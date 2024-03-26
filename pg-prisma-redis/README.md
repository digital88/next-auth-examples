# Getting started

As first step, you should create `.env` using `.env.example` as baseline and provide your own values.
Do not forget to add `PRISMA_SKIP_POSTINSTALL_GENERATE=1` in your `.env` file before running `npm install`.

To build docker image run:

``` lang=sh
make .build-image
```

To run built image:

``` lang=sh
make .run-image
```

Compose file is currently WIP.
