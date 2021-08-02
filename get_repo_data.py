#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
@author: joevest
"""

import os
import json
import requests
from git import Repo

GITHUB_TOKEN = os.environ.get('GITHUB_TOKEN')
api_url_base = "https://api.github.com/repos/"
tracked_repos = "tracked_repos.txt" # list of repos
git_repo_base = "https://github.com/"

datajson = "data.json"

jsonhead='{"data" : [' # data.json head
jsonfoot=']}' # data.json foot

repo_data=[]

headers = {"authorization":"Bearer " + GITHUB_TOKEN}

# Does directory contain a binary?
def contains_binary(root):
    containBin = False
    # init hasBinaryList
    hasBinaryList = []
    for root, dirs, files in os.walk(root):
        for f in files:
            if f.endswith((".exe",".dll",".o")):
                hasBinaryList.append(f)
    return hasBinaryList
            
# Walk through repo list
with open(tracked_repos) as f:
    for repository in f.readlines():
        if repository == "":
            continue #skip blanks
        else:
            # Get Category and Project from line
            value = repository.split(",")
            category = value[0].strip()
            project = value[1].strip()

            # Get GitHub Repo JSON from API
            url = api_url_base + project
            print(url)
            result = requests.get(url,headers=headers)
            if result.status_code == 200:

                repo_data_json = json.loads(result.text)

                # Clone repos for further analysis
                projectPath = "/tmp/" + project.replace('/','_')
                Repo.clone_from(git_repo_base + project + ".git", projectPath)
                
                # Determine if binaries exist in project
                bins = contains_binary(projectPath)
                print(bins)

                # Add custom has_binary field to JSON
                if (bins == ""):
                    repo_data_json['has_binary'] = ""
                else:
                    repo_data_json['has_binary'] = ", ".join(bins)

                # Get latest commit message
                current_repo = Repo(projectPath)
                commit_message = current_repo.head.commit.message

                # Add latest commit message to custom field

                repo_data_json['commit_message'] = commit_message
                
                # Add custom category field to JSON
                repo_data_json['category'] = category
                
                # Add JSON to array
                repo_data_json_text = json.dumps(repo_data_json)
                repo_data.append(repo_data_json_text)
            else:
                print("ERROR: Can not access " + value)
            
# Build final JSON (data.json)            
data = ",".join(repo_data)             
data = jsonhead + data + jsonfoot

with open(datajson, 'w') as f:
    f.write(data)





