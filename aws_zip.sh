#!/bin/bash
echo "zipping project..."
git archive --verbose -o factory-express.zip HEAD;

echo "zipping submodules..."
git submodule foreach 'echo "zipping $name..."; git archive --verbose -o $(basename $name).zip HEAD;'

echo "Unzipping project..."
mkdir zip
unzip factory-express.zip -d zip

echo "Unzipping submodules..."
for file in $(find . -name '*.zip'); do
    if [ $file != "./factory-express.zip" ] && [ $file != "./simulation-factory.zip" ]; then
        echo "Unzipping $file..."
        unzip $file -d zip/$(dirname $file)
    fi
done

echo "Creating final zip file..."
rm -v simulation-factory.zip
cd zip
zip -r ../simulation-factory.zip .
cd ..

echo "Removing temporary files..."
rm -rfv zip
for file in $(find . -name '*.zip'); do
    if [ $file != "./simulation-factory.zip" ]; then
        rm -v $file
    fi
done