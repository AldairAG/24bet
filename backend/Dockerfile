# Etapa 1: Construcción del JAR
FROM maven:3.9-eclipse-temurin-21 AS builder
WORKDIR /app
# Copia el archivo pom.xml y descarga las dependencias
COPY pom.xml .
RUN mvn dependency:go-offline
# Copia el resto del código fuente
COPY src ./src
# Compila el proyecto y genera el JAR
RUN mvn clean package -DskipTests

# Etapa 2: Ejecución del JAR en OpenJDK 21
FROM eclipse-temurin:21-jre
WORKDIR /app
# Copia el archivo JAR generado desde la etapa anterior
COPY --from=builder /app/target/24bet-0.0.1.jar app_24bet.jar
# Expone el puerto 8080 (puerto predeterminado de Spring Boot)
EXPOSE 8080
# Ejecuta el archivo JAR
ENTRYPOINT ["java", "-jar", "app_24bet.jar"]