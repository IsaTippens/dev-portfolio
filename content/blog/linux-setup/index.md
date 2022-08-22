---
title: Linux Setup
description: My tutorial for setuping linux sometime again in the future
date: 2022-08-06
published: false
---
A collection of notes for when I forget how to use linux

## Ubuntu specific

On each install of ubuntu from iso (maybe old, maybe new)
Update the system package cache, also upgrade the system + packages if needed
```
    sudo apt-get update
    sudo apt-get upgrade
```

When installing any package
```
    sudo apt-get update
    sudo apt-get install name name2 name3
```

Some essential stuff
```
    sudo apt-get install build-essential git curl
```

## General Linux

Tar files
- x extract
- z gzip .gz
- v verbose logging
- f file, followed by the file
```
    tar -xzvf file.tar.gz -C ./dest
```
