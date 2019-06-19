# Example app with VoogWebpackPlugin

This example app will do the following things

1. Parse and upload layout and component files to your Voog environment
2. Add cache busting for all asset files (stylesheets, javascripts, images, fonts)
3. Allow more complex folder structures for better organization
4. Parse SASS and ES6 javascript (using babel)
5. Add above the fold CSS to your layouts for faster page loading

It uses 2 separate Voog accounts:

1. Development account (this could be unpaid private Voog account that's not accessible to public)
2. Production account

You can edit the script to only use 1 account if you'd like to do so.

## Development

### Intro 

**Design and template development should be done locally.** Editing files in Voog IDE means the 
code won't get into version control and the changes will be overwritten.

### Configure and install dependencies

1. In `./config.js` add your Voog dev and production page credentials.
3. Run `npm ci`

### How to watch development changes and sync with Voog with every change

3. `npm run watch`  
Additionally you can run `npm run build` to execute the dev deployment only once.

Webpack will only upload files that have different content locally than in Voog. So if you switch a git branch 
then all changes will be uploaded.

_Behind the scenes when you run `npm run watch/build` then `layouts` and `layout_assets` file lists are 
downloaded via Voog API with md5 hashes. Information is cached and if locally build happens then Webpack 
will check if files have changed (md5 hash difference) and which files need to be uploaded._

### Add new components and layouts

To add new layouts or components then you also need to add new entries to you webpack configuration in 
`webpack.config.js`.

### Production deployment

1. Make sure you have production Voog account configuration in `./config.js`.
2. Run `npm run deploy-prod`

### FAQ

1. Are unused files cleaned up and removed from Voog

No.
