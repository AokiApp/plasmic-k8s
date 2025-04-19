cd packages/loader-angular; yarn; cd ..; yarn; npx nx run-many -t build; npx nx run-many -p "@plasmicapp/\*" -t build --exclude @plasmicapp/loader-html-hydrate; npx lerna exec -- yarn pack
