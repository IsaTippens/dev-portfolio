---
title: CTF Cheatsheet
published: false
---

## Networking

### CURL

CLI for making network requests. Typically downloading files, but we can do better.

```bash
# GET
curl https://google.com

# GET With HEADERS
curl https://google.com -H "key: value" -H "key: value"

# GET JSON
curl https://isatippens.com/api/posts -H "Accept: application/json"

# HEAD
curl -I https://google.com

# If destination is a redirect
curl -L https://google.com
```

POST requests allows us to send data. We can exploit this if necessary

```bash
# POST
curl -X POST https://google.com

# POST JSON Data
curl -X POST https://google.com -d '{"key1":"value1", "key2":"value2"}' -H "Content-Type: application/json"

# POST file (can be json or any other data)
curl -X POST http://localhost:3000/data -d "@file.extension"
```

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

### XOR

Not a tool, but theory

Exclusive OR - Given two booleans A and B

| A | B | C|
| --- | --- | --- |
| 0 | 0 | 0 |
| 1 | 0 | 1 |
| 0 | 1 | 1 |
| 1 | 1 | 0 |

In Python

```python
bool_c = bool_a ^ bool_b
```

In Binary

| A | B | C |
| --- | --- | --- |
| 10110 | 01100 | 11010 |

Or just use [this](https://xor.pw/#)

## Hashing

### HASHCAT #️⃣😺

adwanced paffword recovowy toowl.

Can read from a text file of words and run a hashing algorithm until a generated hash matches the given hash. 

We need to identify the hashing algorithm used and through intution (or if given) specify the length of the password. Can either brute force all possible combinations in conjuction with a given file.

learn [hashcat.net](https://hashcat.net/hashcat/) and [hash examples](https://hashcat.net/wiki/doku.php?id=example_hashes)

We also want to use gpu where possible

```bash
hashcat -D 1 -a <attack> -m <mode/hash type> <hash> <wordlist file/charset pattern>
```