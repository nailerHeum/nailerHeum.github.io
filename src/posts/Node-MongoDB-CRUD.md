---
title: Node-MongoDB CRUD
categories: Node
tags:
  - nodejs
  - mongoDB
  - CRUD
  - Promise
date: 2019-03-05 23:36:38
thumbnail:
---
![nodejs](Node-MongoDB-CRUD/nodejs.png)

### SQL과 NoSQL

------

**SQL(Structured Query Language)**

- table 단위
- 1개의 정보(튜플) = row 또는 record
- attribute를 Column이라고 한다.

**NoSQL(Not Only SQL)**

- collection 단위
- 1개의 정보(튜플) = document
- attribute를 field라고 한다.



### Installing MongoDB

------

v4.0.4이고 MacOS이기 때문에 편하게 homebrew로 설치한다. 

ROBO 3T라는 GUI tool을 다운로드했다.

![image-20190305234422235](Node-MongoDB-CRUD/image-20190305234422235.png)

(이러한 GUI를 제공해준다. 명령어 또한 보여주기 때문에 공부도 된다.)



### Connecting and Inserting Documents

------

mongodb 연결하기

mongodb.js

```javascript
const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient

const connectionURL = 'mongodb://127.0.0.1:27017'
const database = 'task-manager'

MongoClient.connect(connectionURL, { useNewUrlParser: true }, (error, client) => { // option useNewUrlParser: true
  if(error) {
    return console.log('unable to connect to database')
  }
  console.log('connected correctly')
}); //callback
```



이후 새로운 데이터베이스를 만들고 컬렉션을 생성하고 추가하는 작업에서 인증 문제로 인해 막혔다. 

이에 대해 몽고디비 공식문서에서 해결책을 찾아냈다.

(http://mongodb.github.io/node-mongodb-native/2.0/reference/connecting/authenticating/)

```javascript
const connectionURL = 'mongodb://csheum:<password>@127.0.0.1:27017'
```

url로 아이디와 패스워드를 넘겨준다.

(실제 배포에 있어서는 보안문제가 발생할 수 있으므로, dotenv를 사용하자.)



```javascript
// CRUD

const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient

const connectionURL = 'mongodb://csheum:password@127.0.0.1:27017'
const databaseName = 'task-manager'


MongoClient.connect(connectionURL, { useNewUrlParser: true }, (error, client) => { // option useNewUrlParser: true
  if(error) {
    return console.log('unable to connect to database')
  }
  
  const db = client.db(databaseName)
  
  db.collection('users').insertOne({
    name: 'Nailer',
    age: '25',
  })// callback
}) //callback
 
```

그 결과

![image-20190305235142548](Node-MongoDB-CRUD/image-20190305235142548.png)

  insertOne method의 error처리와 결과 확인

## Create

----

```javascript
db.collection('users').insertOne({
    name: 'Nailer',
    age: '25',
  }, (error, result) => {
    if(error){
      console.log('unable to insert document')
    }
    console.log(result.ops);
  })// callback
```

1번째 인자는 error, 2번째 인자는 result이다.

result.ops에서 ops는 document를 array로 보여준다.

지금은 1개의 document만 넣었기 때문에 1개만 보인다.

```
[ { name: 'Nailer', age: '25', _id: 5c7b955376ddba7f45a360ac } ]
```

   

여러 document를 create할 때 insertMany method를 사용한다.

```javascript
db.collection('users').insertMany([
    {
      name: 'hyuk',
      age: 25,
    }, {
      name: 'jun',
      age: 25,
    }
  ]
    , (error, result)=>{
      if(error){
        return console.log('unable to insert them')
      }
      console.log(result.ops)
  })
```

http://mongodb.github.io

mongodb API doc. 확인하는 곳! 다양한 옵션들을 확인한다.

   

**MongoDB의 큰 특징 중 하나로 ObjectId는 mongodb에 의해 자동으로 생성된다.** 

- mysql의 auto increment 되는 id와 달리 GUID(Globally Unique Identifier,)를 사용하여  편리하다.
- 총 12byte짜리 정보이며 순서대로
  - 4byte는 UNIX 시간
  - 5byte는 random value
  - 3byte는 random value로 시작하는 counter

https://docs.mongodb.com/manual/reference/method/ObjectId/

(ObjectID에 대한 설명)



## Read

----

```javascript
db.collection('users').findOne({
    name: 'jun',
    age: 21,  
  }, (error, user) => {
    if(error){
      console.log('unable to fetch')
    }
    console.log(user)
  })
```

 탐색결과가 없더라도 탐색 자체의 error가 아니면 error 처리되지 않고 null이 출력됨. 



ObjectID를 이용한 탐색

```javascript
db.collection('users').findOne({
    _id: new ObjectID("5c7b99ce6bafd9a6fb696a4f") // 그냥 스트링으로 들어가면 안되고 ObjectID 타입으로
  }, (error, user) => {
    if(error){
      console.log('unable to fetch')
    }
    console.log(user)
  })
```



**promise와 callback에 대하여**

callback.js

```javascript
const doWorkCallBack = (callback) => {
  setTimeout(() => {
    callback('This is my error', undefined) 
  }, 2000)
}

doWorkCallBack((error, result) => {
  if (error) {
    return console.log(error) 
  }
  console.log(result)
})

```



promise.js

```javascript
console.log('promise.js is running')
const doWorkPromise = new Promise((resolve, reject) => {
  setTimeout(() => {
    reject('well...')
    //resolve([7, 4, 1])
    
  }, 2000)
})

doWorkPromise
  .then((result) => {
    console.log("success", result)
  })
  .catch((error) => {
    console.log(error)
  })

```

 



## Update

----

```javascript
const updatePromise = db.collection('users').updateOne({
     _id: new ObjectID("5c7b99ce6bafd9a6fb696a4f") 
    }, {
      $set: {
        name: 'junijuni',
      }
    })
  updatePromise.then((result) => {
    console.log(result)
  }).catch((error) => {
    console.log(error)
  })
```

updateOne method를 사용하였고, 예상과 다른점은

2번째 argument로 $set 안에 update할 attribute와 그 내용을 넣는다는 점이다. \$set은 다양한 operator 중 하나이다. 아래 목록이 있다.

이후 update가 성공적인지 확인하기 위해 updatePromise를 통해 결과를 확인하면 시행한 update에 대한 매우 긴 정보가 들어있다.



**mongodb update operators**

다양한 옵션들이 있다. 

| Name                                                         | Description                                                  |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| [`$currentDate`](https://docs.mongodb.com/manual/reference/operator/update/currentDate/#up._S_currentDate) | Sets the value of a field to current date, either as a Date or a Timestamp. |
| [`$inc`](https://docs.mongodb.com/manual/reference/operator/update/inc/#up._S_inc) | Increments the value of the field by the specified amount.   |
| [`$min`](https://docs.mongodb.com/manual/reference/operator/update/min/#up._S_min) | Only updates the field if the specified value is less than the existing field value. |
| [`$max`](https://docs.mongodb.com/manual/reference/operator/update/max/#up._S_max) | Only updates the field if the specified value is greater than the existing field value. |
| [`$mul`](https://docs.mongodb.com/manual/reference/operator/update/mul/#up._S_mul) | Multiplies the value of the field by the specified amount.   |
| [`$rename`](https://docs.mongodb.com/manual/reference/operator/update/rename/#up._S_rename) | Renames a field.                                             |
| [`$set`](https://docs.mongodb.com/manual/reference/operator/update/set/#up._S_set) | Sets the value of a field in a document.                     |
| [`$setOnInsert`](https://docs.mongodb.com/manual/reference/operator/update/setOnInsert/#up._S_setOnInsert) | Sets the value of a field if an update results in an insert of a document. Has no effect on update operations that modify existing documents. |
| [`$unset`](https://docs.mongodb.com/manual/reference/operator/update/unset/#up._S_unset) | Removes the specified field from a document.                 |

https://docs.mongodb.com/manual/reference/operator/update/



모든 task들의 completed 를 true로 바꾸기

 db.collection().updateMany()는 다음과 같다.

```javascript
db.collection.updateMany(
   <filter>,
   <update>,
   {
     upsert: <boolean>,
     writeConcern: <document>,
     collation: <document>,
     arrayFilters: [ <filterdocument1>, ... ]
   }
)
```



위를 참고한 결과

```javascript
const updateAllTasksPromise = db.collection('tasks').updateMany({ }, {
    $set: {
      completed: true,
    },
  })
  updateAllTasksPromise
    .then((result) => {
      console.log(result)
    })
    .catch((error) => {
      console.log(error)
    })
```





## Delete

------

 deleteMany는 특정 조건에 부합하는 documents들을 삭제한다.

```javascript
db.collection('users').deleteMany({
    age: 26,
  })
    .then((result) => {
      console.log(result)
    })
    .catch((error) => {
      console.log(error)
    })
  
```



**deleteOne method **

```javascript
db.collection('tasks').deleteOne({
    description: '빨래하기',
  })
    .then((result) => {
      console.log(result)
    })
    .catch((error) => {
      console.log(error)
    })

```

CRUD 모두 단일 document에 대한 처리와 다수의 document에 대한 처리로 나뉜다. 다양한 옵션이 있는 만큼 mongodb 문서에 대한 참고가 많이 필요한 것 같다.

