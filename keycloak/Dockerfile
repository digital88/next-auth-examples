# https://www.keycloak.org/server/containers

ARG KC_BASE_IMAGE_TAG=24.0

FROM quay.io/keycloak/keycloak:${KC_BASE_IMAGE_TAG} as builder

# Enable health and metrics support
ENV KC_HEALTH_ENABLED=true
ENV KC_METRICS_ENABLED=true

# Configure a database vendor
ENV KC_DB=postgres

WORKDIR /opt/keycloak
# for demonstration purposes only, please make sure to use proper certificates in production instead
RUN keytool -genkeypair -storepass password -storetype PKCS12 -keyalg RSA -keysize 2048 -dname "CN=server" -alias server -ext "SAN:c=DNS:localhost,IP:127.0.0.1" -keystore conf/server.keystore
RUN /opt/keycloak/bin/kc.sh build

# ===============================================

FROM quay.io/keycloak/keycloak:${KC_BASE_IMAGE_TAG}

COPY --from=builder /opt/keycloak/ /opt/keycloak/

USER 0

RUN mkdir /ObjectStore/ && chown 1000:0 /ObjectStore/

USER 1000

# change these values to point to a running postgres instance
#ENV KC_DB=postgres
#ENV KC_DB_URL=<DBURL>
#ENV KC_DB_USERNAME=<DBUSERNAME>
#ENV KC_DB_PASSWORD=<DBPASSWORD>
ENV KC_HOSTNAME=localhost

EXPOSE 8443

ENTRYPOINT ["/opt/keycloak/bin/kc.sh"]
