# to use this file in CLI: bash zip.sh

zip -r ${PWD##*/}.zip * -x "node_modules/*" -x "demo/*" -x ".github/*" -x .eslintignore -x .eslintrc.js -x .gitignore -x .travis.yml -x CODEOWNERS -x contributing.md -x zip.sh; echo; echo "created ${PWD##*/}.zip inside this folder"; echo;
