# to use this file in CLI: bash zip.sh

zip -r ${PWD##*/}.zip * .eslintignore .eslintrc.js .gitignore .travis.yml -x "node_modules/*" -x "demo/*" -x zip.sh; echo; echo "created ${PWD##*/}.zip inside this folder"; echo;