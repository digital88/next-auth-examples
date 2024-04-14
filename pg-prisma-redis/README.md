# Getting started

As first step, you should create `.env` using `.env.example` as baseline and provide your own values.
Do not forget to add `PRISMA_SKIP_POSTINSTALL_GENERATE=1` in your `.env` file before running `npm install`.

You need to have NodeJS v18 or later installed locally, if you want to be able to debug.
Best way to ensure it's intalled is via `nvm`:

``` lang=sh
nvm use 18
```

To build docker image run this command:

``` lang=sh
make .build-image
```

To run built image:

``` lang=sh
make .run-image
```

Compose file is currently WIP.
