#!/bin/bash

updatePath() {
    operation="$1"
    file="$2"
    jq "$operation" "$file" >"$file".tmp && mv "$file".tmp "$file"
}

if [ -z "$tag" ]; then
    version="$(git branch --show-current | sed "s/v\?\(.*\)/\1/")"
else
    version="${tag//[v]/}"
fi
semver="echo $version | sed 's/\(\(\.\?[0-9]\+\)\{3\}\).*/\1/'"

updatePath ".version = \"$version\"" manifest.json
updatePath ".version = \"$version\"" package.json

if [ "$version" = "$semver" ]; then
    echo "Update versions.json for next SemVer: $semver"
    npm run version
fi
