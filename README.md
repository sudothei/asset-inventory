# Inventory Asset DB

## To setup MongoDB server

1. Install on Linux using official package: [mongodb.com/docs/manual/administration/install-on-linux](https://www.mongodb.com/docs/manual/administration/install-on-linux/)
2. Enable service: `sudo systemctl enable mongodb`
3. Start service: `sudo systemctl start mongodb` (may require reboot if any errors)
4. Copy the `initdb.js` file to the current directory
5. Run `mongosh`
6. Run `load("initdb.js")`

## To setup the app server

1. Install Docker on Linux: [docs.docker.com/engine/install](https://docs.docker.com/engine/install/)
2. Install Docker Compose: [docs.docker.com/compose/install](https://docs.docker.com/compose/install/)
3. Edit the `env_file` to point to the MongoDB server
4. Run `docker-compose build inventory-asset-db`
5. Run `docker-compose up --no-deps -d inventory-asset-db`

## Finishing steps

1. Sign into the default admin account and change the username and password.
    - Default username: `admin`
    - Default password: `admin`
2. Add users and assign permissions

## FAQ

Why use Rust, TypeScript and MongoDB?

- Because I'm not a boomer who uses old tech.

---

How can I connect directly to the database?

- You can use `mongosh`, but really shouldn't as this can skip input validation
  and cause problems.

---

Can you add a feature for me?

- Unless you're my boss, build it yourself and submit a pull request.
