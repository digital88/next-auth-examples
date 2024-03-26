# Using Keycloak as Identity Provider

This project uses selfhosted Keycloak in docker as id provider, for the sake of simplicity. Configuring external 3rd party providers to use in app takes time, and they are usually pretty compliant with OIDC spec anyway. The code in this repo should work with any external OIDC provider like Google, Github, etc. without making major changes, probably even as little as setting ClientId and ClientSecret to new values.

To run Keycloak, execute this command in separate shell (or use `-d` flag):

```
docker compose up --build

# or

docker compose up -d --build
```

This command will also (re)create a Postgres container as data storage for Keycloak container.

Then visit `https://localhost:8443/` in your browser. If you changed mapped port in `compose.yaml`, also do not forget to change it in browser address bar.
