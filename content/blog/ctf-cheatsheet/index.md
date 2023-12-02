---
title: CTF Cheatsheet
published: false
---

## Networking

### NMAP

We'd typically use this to scan for open ports

```bash
# Scans all ports from 0 to 65535 on localhost ip
nmap -vz -p0-65535 127.0.0.1
```

### WIRESHARK

typically listen on ports can capture data. Allow follow network packets using the gui

```bash
sudo tshark -i <network interface> -f "port <port number>" -w <output capture>

# on ethernet and on http port
sudo tshark -i eth0 -f "port 80" -w <output capture>
```

## Binary 

### BINWALK

Will identify other binaries within an image

```bash
binwalk [Options] <file1> <file2> <etc>

# Scan and list common file types within the image
binwalk -B <file>

# Extract found files
binwalk -e <file>
```

### DD

Can extract data out of a binary. Use in conjunction with BINWALK to find the starting offset
and length to extract.

```bash
dd skip=<offset> count=<length> if=<input file> of=<output file> bs=<block size>
```

Block size is the size of byte sections to copy, count is the number of blocks to copy.

file_size = bs * count