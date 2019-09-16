# Simple Wykop API v2

Small library for making requests to Wykop API v2. 

## Content

1. [Install](#install)
2. [Requirements](#requirements)
3. [Usage](#usage)
4. [Documentation](#ocumentation)
5. [Examples](#examples)
    * [User Login](#user-login)
    * [Hot Entries](#hot-entries)
    * [Post New Entrie](#post-new-entrie)
    * [Get Upvoters](#get-upvoters)
    * [Async Await](#async-await)
6. [License](#license)

## Install

```
npm i wykop-nodejs
```

## Requirements

There are few things thaht Wykop API requires to work:

1. Register new app: https://www.wykop.pl/dla-programistow/nowa-aplikacja/
2. Connect App to your account: https://www.wykop.pl/dla-programistow/twoje-aplikacje/ 

![App Conection](readme_assets/app_connection.jpg) 

Now you have:
  * Klucz[appKey]
  * Sekret[appSecret]
  * Połącznie[accountkey]

## Usage

### Import

``` javascript
const Wykop = require('wykop-nodejs')
```

``` javascript
const API = new Wykop({
  appSecret: 'your-appsecret',
  appKey: 'your-appkey'
})
```

### Request - returns promise

``` javascript
API.request({
  requestMethod: 'POST' | 'GET',
  urlParams: String[],
  fullData?: Boolean, // Response with full data or compact
  apiParams?: String[],
  postParams?: Object,
  namedParams?: Object
})
```

Check out [expamples](#examples) below for details.

## Documentation

Ok first of all quick explanation. 

Lets say we wanna fetch some hot entires. Endpoint url in [documntation](https://www.wykop.pl/dla-programistow/apiv2docs/package/Entries/#pEntries_Hot) looks like that:

```
https://a2.wykop.pl/Entries/Hot/page/int/period/int/
```

We can omit base api url so we get:

```
Entries/Hot/page/int/period/int/
```

All uppercase words are our **urlParams** so we have to pass them to the request as an Array of strings:

``` javascript
urlParams: ['Entries', 'Hot']
```

And our **namedParams** are: 

```
page/int/period/int/
```

So we pass them as an Object:

``` javascript
namedParams: {
  page: 1,
  period: 6
}
```

Some methods require **apiParams** like:

```
https://a2.wykop.pl/Tags/Index/page/int/tag/ - tag is apiParam
```

We pass them also as an Arry of strings:

``` javascript
apiParams: ['rozdajo']
```

Check out https://www.wykop.pl/dla-programistow/apiv2docs/ for all methods list.

## Examples

### User Login

``` javascript
const Wykop = require('wykop-nodejs')

const API = new Wykop({
  appSecret: 'your-appsecret',
  appKey: 'your-appkey'
})

/* UserKey will be stored in API.userKey so if you chain next request there is no need to provide it.

Ypu can always handle userKey by your code just grab it from res.data in .then block and when you need it asign it to API.userKey */

API.request({
  requestMethod: 'POST',
  urlParams: ['Login', 'Index'],
  postParams: {
    accountkey: 'your-accountkey'
  }
})
.then(res => console.log(res)) 
.catch(err => console.log(err))
```

### Hot Entries

``` javascript
const Wykop = require('wykop-nodejs')

const API = new Wykop({
  appSecret: 'your-appsecret',
  appKey: 'your-appkey'
})

API.request({
  requestMethod: 'POST',
  urlParams: ['Login', 'Index'],
  postParams: {
    accountkey: 'your-accountkey'
  }
})
.then(() => {
  API.request({
    requestMethod: 'GET',
    urlParams: ['Entries', 'Hot'],
    fullData: true,
    namedParams: {
      page: 1,
      period: 6
    }
  })
  .then(res => console.log(res))
  .catch(err => console.log(err))
})
.catch(err => console.log(err))
```

### Post New Entrie

``` javascript
const Wykop = require('wykop-nodejs')

const API = new Wykop({
  appSecret: 'your-appsecret',
  appKey: 'your-appkey'
})

API.request({
  requestMethod: 'POST',
  urlParams: ['Login', 'Index'],
  postParams: {
    accountkey: 'your-accountkey'
  }
})
.then(() => {
  API.request({
    requestMethod: 'POST',
    urlParams: ['Entries', 'Add'],
    postParams: {
      body: 'Content of your entrie.',
    }
  })
  .then(res => console.log(res))
  .catch(err => console.log(err))
})
.catch(err => console.log(err))
```

### Get Upvoters

``` javascript
const Wykop = require('wykop-nodejs')

const API = new Wykop({
  appSecret: 'your-appsecret',
  appKey: 'your-appkey'
})

API.request({
  requestMethod: 'POST',
  urlParams: ['Login', 'Index'],
  postParams: {
    accountkey: 'your-accountkey'
  }
})
.then(() => {
  API.request({
    requestMethod: 'GET',
    urlParams: ['Entries', 'Upvoters'],
    apiParams: ['43874835']
  })
  .then(res => console.log(res))
  .catch(err => console.log(err))
})
.catch(err => console.log(err))
```

### Async Await

```javascript
(async function() {
  const Wykop = require('wykop-nodejs')
  try {
    const API = new Wykop({
      appSecret: 'your-appsecret',
      appKey: 'your-appkey'
    })
    await API.request({
      requestMethod: 'POST',
      urlParams: ['Login', 'Index'],
      postParams: {
        accountkey: 'your-accountkey'
      }
    })
    const response = await API.request({
      requestMethod: 'POST',
      urlParams: ['Profiles', 'Observe'],
      apiParams: ['schriker'],
    })
    console.log(response)
  } catch (err) {
    console.log(err)
  }
})()
```