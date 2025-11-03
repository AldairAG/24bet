package com._bet.service.apuesta;

import java.util.List;
import java.util.ArrayList;
import java.util.Locale;
import java.util.Objects;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com._bet.entity.eventoEntity.Momio;
import com._bet.entity.eventoEntity.Valor;
import com._bet.repository.MomioRepository;
import com._bet.repository.ValorRepository;
import jakarta.transaction.Transactional;

@Service
public class DeterminarResultadoApuesta {
    private final List<String> tipoDeApuesta = List.of("Match Winner", "Home/Away",
            "Second Half Winner", "Asian Handicap", "Goals Over/Under", "Goals Over/Under First Half",
            "Goals Over/Under - Second Half", "HT/FT Double", "Clean Sheet – Home", "Clean Sheet – Away",
            "Both Teams Score", "Win to Nil – Home", "Win to Nil – Away", "Handicap Result", "Exact Score",
            "Highest Scoring Half", "Correct Score - First Half", "Correct Score - Second Half",
            "Double Chance", "First Half Winner", "Team To Score First", "Team To Score Last",
            "Win Both Halves", "Total – Home", "Total – Away", "Asian Handicap First Half",
            "Double Chance - First Half", "Odd/Even", "Odd/Even - First Half",
            "Odd/Even - Second Half", "Goal Line", "Goal Line (1st Half)");

    private static final Logger log = LoggerFactory.getLogger(DeterminarResultadoApuesta.class);

    @Autowired
    private MomioRepository momioRepository;

    @Autowired
    private ValorRepository valorRepository;

    public enum Team {
        HOME, AWAY
    }

    /**
     * Datos mínimos para evaluar mercados comunes de fútbol.
     */
    public static class ResultadoEvento {
        public String equipoHome;
        public String equipoAway;
        public int golesHomeFT;
        public int golesAwayFT;
        public Integer golesHomeHT; // opcional
        public Integer golesAwayHT; // opcional
        public Team primerAnota; // opcional
        public Team ultimoAnota; // opcional

        public int totalGolesFT() {
            return golesHomeFT + golesAwayFT;
        }

        public int totalGolesHT() {
            return nvl(golesHomeHT) + nvl(golesAwayHT);
        }

        public int golesHome2T() {
            return golesHomeFT - nvl(golesHomeHT);
        }

        public int golesAway2T() {
            return golesAwayFT - nvl(golesAwayHT);
        }

        private int nvl(Integer v) {
            return v == null ? 0 : v;
        }
    }

    /**
     * Resuelve y persiste los resultados (isGanador) de todos los momios de un
     * evento.
     */
    @Transactional
    public void resolverResultadosDeEvento(Long eventoId, ResultadoEvento resultado) {
        List<Momio> momios = momioRepository.findByEventoDeportivoId(eventoId);
        if (momios == null || momios.isEmpty()) {
            log.info("No hay momios para evento {}", eventoId);
            return;
        }

        List<Valor> aGuardar = new ArrayList<>();
        for (Momio m : momios) {
            if (m.getValores() == null || m.getValores().isEmpty())
                continue;
            // reset
            m.getValores().forEach(v -> v.setIsGanador(Boolean.FALSE));
            // resolver según tipo
            String tipo = safe(m.getTipoApuesta());
            switch (tipo) {
                case "Match Winner":
                case "Home/Away":
                    resolverMatchWinner(m, resultado);
                    break;
                case "First Half Winner":
                    resolverHalfWinner(m, resultado, 1);
                    break;
                case "Second Half Winner":
                    resolverHalfWinner(m, resultado, 2);
                    break;
                case "Goals Over/Under":
                    resolverOverUnderTotal(m, resultado.totalGolesFT());
                    break;
                case "Goals Over/Under First Half":
                    resolverOverUnderTotal(m, resultado.totalGolesHT());
                    break;
                case "Goals Over/Under - Second Half":
                    resolverOverUnderTotal(m, resultado.golesHome2T() + resultado.golesAway2T());
                    break;
                case "Both Teams Score":
                    resolverBTTS(m, resultado);
                    break;
                case "Exact Score":
                    resolverExactScore(m, resultado.golesHomeFT, resultado.golesAwayFT);
                    break;
                case "Double Chance":
                    resolverDoubleChance(m, resultado.golesHomeFT, resultado.golesAwayFT);
                    break;
                case "Odd/Even":
                    resolverOddEven(m, resultado.totalGolesFT());
                    break;
                case "Odd/Even - First Half":
                    resolverOddEven(m, resultado.totalGolesHT());
                    break;
                case "Odd/Even - Second Half":
                    resolverOddEven(m, resultado.golesHome2T() + resultado.golesAway2T());
                    break;
                case "Team To Score First":
                    resolverTeamToScore(m, resultado.primerAnota);
                    break;
                case "Team To Score Last":
                    resolverTeamToScore(m, resultado.ultimoAnota);
                    break;
                case "Clean Sheet – Home":
                    resolverYesNo(m, resultado.golesAwayFT == 0);
                    break;
                case "Clean Sheet – Away":
                    resolverYesNo(m, resultado.golesHomeFT == 0);
                    break;
                default:
                    log.warn("Tipo de apuesta no implementado aún: {} (evento {})", tipo, eventoId);
                    break;
            }
            aGuardar.addAll(m.getValores());
        }
        if (!aGuardar.isEmpty()) {
            valorRepository.saveAll(aGuardar);
        }
    }

    /** Método de conveniencia con parámetros básicos. */
    @Transactional
    public void resolverResultadosDeEvento(Long eventoId,
            int golesHomeFT, int golesAwayFT,
            Integer golesHomeHT, Integer golesAwayHT,
            Team primerAnota, Team ultimoAnota) {
        ResultadoEvento r = new ResultadoEvento();
        r.golesHomeFT = golesHomeFT;
        r.golesAwayFT = golesAwayFT;
        r.golesHomeHT = golesHomeHT;
        r.golesAwayHT = golesAwayHT;
        r.primerAnota = primerAnota;
        r.ultimoAnota = ultimoAnota;
        resolverResultadosDeEvento(eventoId, r);
    }

    /**
     * Devuelve los resultados (ganadores) de todos los momios de un evento.
     */
    @Transactional
    public List<MomioResultadoDto> obtenerResultadosDeEvento(Long eventoId) {
        List<Momio> momios = momioRepository.findByEventoDeportivoId(eventoId);
        return momios.stream().map(m -> {
            MomioResultadoDto dto = new MomioResultadoDto();
            dto.momioId = m.getId();
            dto.tipoApuesta = m.getTipoApuesta();
            dto.valores = m.getValores() == null ? List.of() : m.getValores().stream().map(v -> {
                ValorResultadoDto vr = new ValorResultadoDto();
                vr.valorId = v.getId();
                vr.valor = v.getValor();
                vr.isGanador = Boolean.TRUE.equals(v.getIsGanador());
                return vr;
            }).collect(Collectors.toList());
            return dto;
        }).collect(Collectors.toList());
    }

    // ----------------- Resolvers -----------------

    private void resolverMatchWinner(Momio m, ResultadoEvento r) {
        int h = r.golesHomeFT, a = r.golesAwayFT;
        for (Valor v : safeList(m.getValores())) {
            String val = norm(v.getValor());
            boolean win = (val.equals("HOME") && h > a) || (val.equals("AWAY") && a > h)
                    || (val.equals("DRAW") && a == h);
            v.setIsGanador(win);
        }
    }

    private void resolverHalfWinner(Momio m, ResultadoEvento r, int half) {
        int h, a;
        if (half == 1) {
            h = nvl(r.golesHomeHT);
            a = nvl(r.golesAwayHT);
        } else {
            h = r.golesHome2T();
            a = r.golesAway2T();
        }
        for (Valor v : safeList(m.getValores())) {
            String val = norm(v.getValor());
            boolean win = (val.equals("HOME") && h > a) || (val.equals("AWAY") && a > h)
                    || (val.equals("DRAW") && a == h);
            v.setIsGanador(win);
        }
    }

    private void resolverOverUnderTotal(Momio m, int totalGoles) {
        for (Valor v : safeList(m.getValores())) {
            OU ou = parseOverUnder(v.getValor());
            if (ou == null) {
                v.setIsGanador(false);
                continue;
            }
            boolean win = (ou.isOver && totalGoles > ou.linea) || (!ou.isOver && totalGoles < ou.linea);
            // Nota: si total == linea, típicamente es "push" (Goal Line). Aquí no se marca
            // ganador.
            v.setIsGanador(win);
        }
    }

    private void resolverBTTS(Momio m, ResultadoEvento r) {
        boolean btts = r.golesHomeFT > 0 && r.golesAwayFT > 0;
        for (Valor v : safeList(m.getValores())) {
            String val = norm(v.getValor());
            boolean win = (val.equals("YES") && btts) || (val.equals("NO") && !btts);
            v.setIsGanador(win);
        }
    }

    private void resolverExactScore(Momio m, int gh, int ga) {
        for (Valor v : safeList(m.getValores())) {
            Score s = parseScore(v.getValor());
            v.setIsGanador(s != null && s.h == gh && s.a == ga);
        }
    }

    private void resolverDoubleChance(Momio m, int gh, int ga) {
        for (Valor v : safeList(m.getValores())) {
            String dc = norm(v.getValor());
            boolean homeWin = gh > ga, draw = gh == ga, awayWin = ga > gh;
            boolean win = (dc.equals("1X") && (homeWin || draw)) ||
                    (dc.equals("12") && (homeWin || awayWin)) ||
                    (dc.equals("X2") && (draw || awayWin));
            v.setIsGanador(win);
        }
    }

    private void resolverOddEven(Momio m, int total) {
        boolean odd = (total % 2) != 0;
        for (Valor v : safeList(m.getValores())) {
            String val = norm(v.getValor());
            boolean win = (val.equals("ODD") && odd) || (val.equals("EVEN") && !odd);
            v.setIsGanador(win);
        }
    }

    private void resolverTeamToScore(Momio m, Team team) {
        for (Valor v : safeList(m.getValores())) {
            String val = norm(v.getValor());
            boolean win = (team == Team.HOME && val.equals("HOME")) || (team == Team.AWAY && val.equals("AWAY"));
            v.setIsGanador(win);
        }
    }

    private void resolverYesNo(Momio m, boolean isYes) {
        for (Valor v : safeList(m.getValores())) {
            String val = norm(v.getValor());
            v.setIsGanador((isYes && val.equals("YES")) || (!isYes && val.equals("NO")));
        }
    }

    // ----------------- DTOs de respuesta -----------------
    public static class MomioResultadoDto {
        public Long momioId;
        public String tipoApuesta;
        public List<ValorResultadoDto> valores;
    }

    public static class ValorResultadoDto {
        public Long valorId;
        public String valor;
        public boolean isGanador;
    }

    // ----------------- Utilidades -----------------
    private static String safe(String s) {
        return s == null ? "" : s;
    }

    private static List<Valor> safeList(List<Valor> l) {
        return l == null ? List.of() : l;
    }

    private static String norm(String s) {
        if (s == null)
            return "";
        s = s.trim();
        if (s.equalsIgnoreCase("home"))
            return "HOME";
        if (s.equalsIgnoreCase("away"))
            return "AWAY";
        if (s.equalsIgnoreCase("draw") || s.equalsIgnoreCase("empate") || s.equalsIgnoreCase("x"))
            return "DRAW";
        if (s.equalsIgnoreCase("sí") || s.equalsIgnoreCase("si") || s.equalsIgnoreCase("yes"))
            return "YES";
        if (s.equalsIgnoreCase("no"))
            return "NO";
        if (s.equalsIgnoreCase("odd") || s.equalsIgnoreCase("impar"))
            return "ODD";
        if (s.equalsIgnoreCase("even") || s.equalsIgnoreCase("par"))
            return "EVEN";
        return s.toUpperCase(Locale.ROOT);
    }

    private static class OU {
        boolean isOver;
        double linea;
    }

    private static OU parseOverUnder(String raw) {
        if (raw == null)
            return null;
        String s = raw.trim().toLowerCase(Locale.ROOT);
        // soporta "Over 2.5" / "Under 1.5" / "Más de 2.5" / "Menos de 2.5"
        boolean over = s.startsWith("over") || s.startsWith("más") || s.startsWith("mas");
        boolean under = s.startsWith("under") || s.startsWith("menos");
        if (!over && !under)
            return null;
        String digits = s.replaceAll("[^0-9\\.]", "");
        try {
            double line = Double.parseDouble(digits);
            OU ou = new OU();
            ou.isOver = over;
            ou.linea = line;
            return ou;
        } catch (NumberFormatException ex) {
            return null;
        }
    }

    private static class Score {
        int h;
        int a;
    }

    private static Score parseScore(String raw) {
        if (raw == null)
            return null;
        Matcher m = Pattern.compile("^(\\d+)[-:](\\d+)$").matcher(raw.trim());
        if (m.find()) {
            Score s = new Score();
            s.h = Integer.parseInt(m.group(1));
            s.a = Integer.parseInt(m.group(2));
            return s;
        }
        return null;
    }

    private static int nvl(Integer v) {
        return v == null ? 0 : v;
    }

}
