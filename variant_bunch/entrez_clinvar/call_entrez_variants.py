#!/usr/bin/python

# Version 0.0.1
# Initial version of code that pulls data from Entrez to get a list of variants for a gene, and get the data record for a variant
# Needs further work to get variant data in batches if possible, or to loop through all variants and pull the data for each
# and save the results

from Bio import Entrez
from urllib.error import HTTPError

Entrez.email = ""

#Get variant ids for a gene
query_gene = "DMD"
search_handle = Entrez.esearch(db="clinvar", rettype="clinvarset",term=query_gene, retmax=10000, usehistory="y")
result = Entrez.read(search_handle)
search_handle.close()
idlist = result["IdList"]

#Get data for a variant id
variant_ids=idlist[0]
search_results = Entrez.read(Entrez.epost("clinvar", id=583999))
webenv = search_results["WebEnv"]
query_key = search_results["QueryKey"]

fetch_handle = Entrez.efetch(db="clinvar", rettype="clinvarset", retmode="xml", retstart=0, retmax=100, webenv=webenv, query_key=query_key)
data = fetch_handle.read()
fetch_handle.close()

#Print the results
print(data)


