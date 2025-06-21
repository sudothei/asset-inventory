# Inventory Asset DB

## To setup MongoDB server

1. Install on Linux using official package: [mongodb.com/docs/manual/administration/install-on-linux](https://www.mongodb.com/docs/manual/administration/install-on-linux/)
2. Enable service: `sudo systemctl enable mongodb`
3. Start service: `sudo systemctl start mongodb` (may require reboot if any errors)
4. Copy the `initdb.js` file to the current directory and edit it to set the DB password
5. Run `mongosh`
6. Run `load("initdb.js")`, it will prompt for a password to use for the admin
   account (this is different from the inventoryAssetDB service account)
7. Add the following to `/etc/mongodb.conf`

    ```conf
    security:
        authorization: enabled
    ```

8. Run `sudo systemctl restart mongodb` to apply security changes

## To setup the app server

1. Install Docker on Linux: [docs.docker.com/engine/install](https://docs.docker.com/engine/install/)
2. Install Docker Compose: [docs.docker.com/compose/install](https://docs.docker.com/compose/install/)
3. Edit the `.env` to your preferences
4. Include any necessary SSL certificates in the `api/certificates` folder and
   add a `.crt` extension.
5. Run `sudo docker login` and enter credentials if applicable
6. Run `sudo docker-compose build`
7. Run `sudo docker-compose up --no-deps -d`

## Finishing steps

1. Visit the web app in the browser
2. Sign into the default admin account and change the username and password
    - Default username: `admin`
    - Default password: `admin`
3. Add users and assign permissions

## FAQ

**Q:** How can I connect directly to the database?

**A:** You can use `mongosh`, but really shouldn't as this can skip input validation
  and cause problems.

---

**Q:** How do I  migrate the database?

**A:** Use `mongodump` and `mongorestore`

To back up: `mongodump -d <database_name> -o <directory_backup>`

To restore: `mongorestore -d <database_name> <directory_backup>`=

---

**Q:** How do I backup the database?

**A:** Use filesystem snapshots as `mongodump` is not a resilient backup method.

---

**Q:** Can you add a feature for me?

**A:** Unless you're my boss, build it yourself and submit a pull request.

---

**Q:** Why use Rust, TypeScript and MongoDB?

**A:** Because I'm not a boomer who uses old tech.
 
 
