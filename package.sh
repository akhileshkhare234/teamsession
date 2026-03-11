#!/bin/bash
echo "Creating manifest file..."
echo "Build-Number: $RELEASE_VERSION" > manifest.txt
echo "Build-Branch: $CI_COMMIT_REF_NAME" >> manifest.txt

echo "Extracting webapp..."
rm -rf target
mkdir -p target/repo/public
tar -xvzf webapp.tar.gz -C target/repo/public

echo "Creating JAR..."
jar cfm $JAR_FILE_NAME manifest.txt -C target/repo .

echo "Generating pom.xml..."
cat <<EOF > pom.xml
<project xmlns='http://maven.apache.org/POM/4.0.0'
    xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance'
    xsi:schemaLocation='http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd'>
    <modelVersion>4.0.0</modelVersion>
    <groupId>${GROUP_ID}</groupId>
    <artifactId>${ARTIFACT_ID}</artifactId>
    <version>${RELEASE_VERSION}</version>
    <packaging>jar</packaging>
</project>
EOF
