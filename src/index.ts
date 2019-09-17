const axios = require('axios')
const qs = require('qs')
const md5 = require('md5')

type apiConfig = {
  appSecret: string,
  appKey: string
}

type requestMethod = 'GET' | 'POST'

type paramsObject = {
  [key: string]: string | number
}

type requestObject = {
  requestMethod: requestMethod,
  url: string,
  apiSign: string,
  postParams?: object
}

type requestData = {
  requestMethod: requestMethod, 
  urlParams: string[],
  fullData?: boolean, 
  namedParams?: paramsObject | undefined, 
  postParams?: {[key: string]: string | number},
  apiParams?: string[] | undefined
}

class Wykop {
  private appSecret: string
  private appKey: string
  public userKey: string = ''
  
  constructor ({ appSecret, appKey }: apiConfig) {
    this.appSecret = appSecret
    this.appKey = appKey
  }

  private createUrl (urlParams: string[], namedParams: paramsObject | undefined, apiParams: string[] | undefined, fullData: boolean | undefined): string {
    let joinedNamedParams: string = ''
    let joinedApiParams: string = ''
    const baseUrl = `https://a2.wykop.pl/${urlParams.join('/')}`
    if (namedParams) {
      joinedNamedParams = Object.entries(namedParams).map(([ key, value ]) => `/${key}/${value}`).join('')
    }
    if (apiParams) {
      joinedApiParams = `/${apiParams.join('/')}`
    }
    return `${baseUrl}${joinedApiParams}${joinedNamedParams}/appkey/${this.appKey}/userkey/${this.userKey}/data/${fullData ? 'full' : 'compact'}`
  }

  private createApiSign (requestUrl: string, postParams?: {[key: string]: string | number}): string {
    let postParamsString: string = ''
    if (postParams) {
      postParamsString = Object.keys(postParams).map((key: string) => postParams[key]).join(',')
    }
    return md5(`${this.appSecret}${requestUrl}${postParamsString}`)
  }

  private  makeRequest ({ requestMethod, url, apiSign, postParams }: requestObject): Promise<any> {
    return axios({
      method: requestMethod,
      url: url,
      headers: {
        'apisign': apiSign,
        'User-Agent': 'wykop-nodejs',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: qs.stringify(postParams)
      })
  }

  public request({ requestMethod, urlParams, namedParams, postParams, apiParams, fullData }: requestData): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = this.createUrl(urlParams, namedParams, apiParams, fullData)
      const apiSign = this.createApiSign(url, postParams)
      const request: requestObject = {
        requestMethod: requestMethod,
        url: url,
        apiSign: apiSign,
        postParams: postParams
      }
      this.makeRequest(request)
        .then((res) => {
          if (res.data.data === null) {
            reject(res)
          } else if (urlParams[0].toLowerCase() === 'login') {
            this.userKey = res.data.data.userkey
            resolve(res.data)
          } else {
            resolve(res.data)
          }
        })
        .catch((err) => reject(err))
    })
  }
}

module.exports = Wykop