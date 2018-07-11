# node-siteMonitor

Check out: https://gentle-island-90040.herokuapp.com

A Node.js uptime monitor for http/https websites over the internet.

Uses File system over a conventional relational database for storing data.
Uses no npm library of any sort. Uses predefined node modules.
A user can create a check for any website they desire, they will recieve a SMS using twilio when the status of their website changes.
A maximum of 5 checks are allowed per user.

<h1>Steps to Use: </h1>

<p>1. Create a .data folder in the root directory. </p>
<p>2. Inside .data folder, create a users, checks, and a tokens folder. </p>
<p>3. Also create a .logs folder in the root directory. </p>
<p>4. You can set your twilio configration credentials in config.js in the root directory. </p>

<h2> node index.js and fire away! </h2>
