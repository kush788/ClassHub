FROM eclipse-temurin:21-jdk AS build

WORKDIR /app

COPY .mvn .mvn
COPY mvnw pom.xml ./

RUN chmod +x mvnw
RUN ./mvnw dependency:go-offline -B

COPY src ./src

RUN ./mvnw clean package -DskipTests

RUN find target -maxdepth 1 \
    -name "*.jar" \
    ! -name "*.original" \
    -exec cp {} target/app.jar \;

FROM eclipse-temurin:21-jre

WORKDIR /app

COPY --from=build /app/target/app.jar app.jar

EXPOSE 8083

ENTRYPOINT ["java", "-jar", "app.jar"]