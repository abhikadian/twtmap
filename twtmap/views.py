import os
import json
from django.conf import settings
from django.shortcuts import render

from django.http import HttpResponse
from requests_aws4auth import AWS4Auth
from django.views.decorators.http import require_GET
from elasticsearch import Elasticsearch, RequestsHttpConnection


#Setup AWS
AWSElasticPath = "path"
AWSAccessKey = "key"
AWSSecretKey = "sshhh"
AWSRegion = "us-west-2"

#authenticate
aws_auth = AWS4Auth(AWSAccessKey, AWSSecretKey, AWSRegion, "es")

#elastic search
elasticSearch = Elasticsearch(hosts = [{'host': AWSElasticPath, 'port': 443}],http_auth = aws_auth,use_ssl = True,verify_certs = True,connection_class = RequestsHttpConnection)

def index(request):
    return render(request,'twtmap/index.html')

@require_GET
def keySelect(request):

    returnResult = {
        "resultJson": []
    }

    print("search query: " + str(request.GET['keyword']))
    searchKeyword = str(request.GET['keyword'])

    if searchKeyword is None or searchKeyword == '' or searchKeyword == 'All':
        elasticQuery = {'match_all':{}}
    else:
        elasticQuery = {"query_string": {"query": searchKeyword.lower() } }

    searchResult = elasticSearch.search(index="elasticindex", body={"size": 10000, "query": elasticQuery})

    try:
        for entry in searchResult['hits']['hits']:
            result = entry['_source']
            returnResult['resultJson'].append(result)

    except KeyError:
        print("No Results found")

    print(len(returnResult['resultJson']))
    return HttpResponse(json.dumps(returnResult), content_type="application/json")
