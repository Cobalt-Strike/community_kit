#!/usr/bin/env bash

# Cobalt Strike Community Kit Updater

# Variables
cwd=`pwd`
community_kit_path=$cwd/"community_kit"
community_kit_projects="https://raw.githubusercontent.com/Cobalt-Strike/community_kit/main/tracked_repos.txt"
community_kit_readme="https://raw.githubusercontent.com/Cobalt-Strike/community_kit/main/README.md"
community_kit_license="https://raw.githubusercontent.com/Cobalt-Strike/community_kit/main/LICENSE"

# Start
echo "###################################################"
echo "##  COBALT STRIKE                                  "
echo "##  Community Kit Download and Update Tool         "              
echo "##  https://github.com/Cobalt-Strike/community_kit "
echo "###################################################"
echo ""

## Check if "community_kit" directory exists
echo "[*] Checking for Community Kit directory:" $community_kit_path
if [ -d $community_kit_path ]
then
    echo "[+] Checking for Community Kit directory: FOUND"
else
    echo "[-] Checking for Community Kit directory: NOT FOUND"
    echo "[*] Creating" $community_kit_path
    mkdir $community_kit_path
fi

## CD to community kit directory
cd $community_kit_path

## Pull latest list of Community Kit Projects
echo "[*] Downloading latest project list"
[ -e $community_kit_projects ] && rm $community_kit_projects
curl -s -O -A "Community Kit" $community_kit_projects

## Pull latest Community Kit README
echo "[*] Downloading latest README"
[ -e $community_kit_readme ] && rm $community_kit_readme
curl -s -O -A "Community Kit" $community_kit_readme

## Pull latest Community Kit LICENSE
echo "[*] Downloading latest LICENSE"
[ -e $community_kit_license ] && rm $community_kit_license
curl -s -O -A "Community Kit" $community_kit_license

## Clone or Update each repository

IFS=$'\n'       # make newlines the only separator
set -f          # disable globbing
for i in $(cat < "$community_kit_path/tracked_repos.txt"); do

  cd $community_kit_path

  author=`echo "$i" | cut -d' ' -f2- | cut -d'/' -f1` 
  project=`echo "$i" | cut -d' ' -f2- | cut -d'/' -f2` 

  if [ -d $community_kit_path/$author/$project ]
  then
    # Project exists
    # Git pull
    echo "[+] Project (" $author/$project ") does exists"
    echo "[*] Updating $author/$project"
    cd $community_kit_path/$author/$project
    git pull --quiet --depth 1
    
  else
    # Project does not exist
    # Git Clone
    echo "[-] Project (" $author/$project ") does NOT exist"

    # Clone repo
    echo "[*] Cloning $author/$project"
    git clone --quiet --depth 1 https://github.com/$author/$project $community_kit_path/$author/$project
    
  fi    

done

echo "####################################################"
echo "[*] The Cobalt Strike Community Kit has been updated"
echo "[*] Community kit directory:" $community_kit_path


