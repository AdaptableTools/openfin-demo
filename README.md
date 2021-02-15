# OpenFin AdapTable demo

## Running the app live

If you want to run the live app, just run the command below on a Windows machine

```sh
$ npx openfin-cli --launch --config https://openfin-demo.adaptabletools.com/openfin-app.json
```

This will launch the OpenFin runtime and open the AdapTable demo for you.

### Running in dev

For running in development, you need to have access to the AdapTable private npm registry [https://registry.adaptabletools.com](https://registry.adaptabletools.com).

To gain access to this registry please follow these steps:

1. Acquire a commercial AdapTable License - you can email [`support@adaptabletools.com`](mailto:support@adaptabletools.com) who will provide you with your unique credentials.

2. Point your npm client to the correct registry for packages under the `@adaptabletools` scope

   `npm config set @adaptabletools:registry https://registry.adaptabletools.com`

   if you're using yarn

   `yarn config set @adaptabletools:registry https://registry.adaptabletools.com`

3. Login to the AdapTable private registry:

   `npm login --registry=https://registry.adaptabletools.com --scope=@adaptabletools`

4. Enter the credentials that were provided to you by the AdapTable support team:

- login name
- email
- password

5. Check you are logged-in correctly by using whoami:

   `npm whoami --registry=https://registry.adaptabletools.com`

This should display the username you received as the current login on the private registry

After all the above, make sure you run `npm install` and then you can run the following 2 commands:

```sh
$  npm run dev
```

and

```sh
$  npm run dev-openfin
```
