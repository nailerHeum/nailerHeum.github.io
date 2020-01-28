---
title: Node-간단한-보안-1
categories: Node
tags:
  - nodejs
  - Auth
  - Security
  - JWT
date: 2019-03-26 14:28:11
thumbnail:
---

{% asset_img nodejs.png nodejsImage %}



### Securely Storing Passwords

----

hashing algorithm을 사용할 것이다. 

**bcrypt** library를 활용하여  fakepw에 hashing algorithm을 8번 시행하여 암호화 시킨다.

hashing algorithm은 one way algorithm으로 process를 reversing 할 수 없다.

```javascript
const bcrypt = require('bcrypt')

const testFunction = async () => {
  const fakepw = 'piggoesoinkoink'
  const hashedPw = await bcrypt.hash(fakepw, 8)

  console.log(fakepw, '=>', hashedPw)
  const isMatch = bcrypt.compare('piggoesoinkoink', hashedPw)
  console.log(isMatch)
}

testFunction()


// result

// piggoesoinkoink => $2b$08$G/tNhrl30dcJK.jSyayAUevM4dUPC5IeHjRiFxbUwp6ivgkKNrLC6
```



user의 password에 대한 암호화를 진행한다.

middleware

```javascript
userSchema.pre('save', async function (next) {  // binding을 위해 arrow function을 쓰지 않는다. (middleware)
  const user = this
  console.log('just before saving')
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8)
  }

  next()	//
})
```



userRouter에 수정을 가해준다. save()에 대한 preprocessing이 가능하도록

```js
try {
    const user = await User.findById(req.params.id)
    user.name = 'Something else'

    updates.forEach(update => user[update] = req.body[update])
    
    if (!user) {
      return res.status(404).send()
    }
    res.status(200).send(user)
  }
```



### Logging in Users

----

- [mongoose methods&statics](<https://mongoosejs.com/docs/2.7.x/docs/methods-statics.html>)

Each `Schema` can define instance and static methods for its model.

**statics** : 

Statics are pretty much the same as methods but allow for defining functions that exist directly on your Model.



따라서 Model에 직접적으로 존재할 findByCredentials라는 static method를 만든다.

```js
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email: email })
  if(!user) {
    throw new Error('Invalid Email or Password')
  }
  const isMatch = await bcrypt.compare(user.password, password)
  if(!isMatch) {
    throw new Error('Invalid Email or Password')
  }
}
```

```js
router.post('/users/login', async (req, res) => {
  try {
    const user = await User.findByCredentials(req.body.email, req.body.password)
    res.status(202).send(user)
  } catch (error) {
    res.status(400).send()
  }
})
```



### JWT(Json Web Token)

----

**JSON** : JavaScript Object Notation



JWT Test

```js
const jwt = require('jsonwebtoken')

const jwtTest = () => {
  const token = jwt.sign({ _id: '1234k22nk2k2' }, 'JWT_SECRET', { expiresIn: '7 second' })
  console.log(token, 'jwt token working')

  const data = jwt.verify(token, 'JWT_SECRET')
  console.log(data)
}

jwtTest()

// result
//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiIxMjM0azIybmsyazIiLCJpYXQiOjE1NTM4Mzk0NTN9.mJpKHQE1sNNZ1vBirMq1vg9I_KEloc3_2lD8367jylU jwt token working
//{ _id: '1234k22nk2k2', iat: 1553843320, exp: 1553843327 }
```

**JWT RESULT 분석**

(**Header**)		- base64 encoded JSON string

eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9 

.

(**body or payload**)

eyJfaWQiOiIxMjM0azIybmsyazIiLCJpYXQiOjE1NTM4Mzk0NTN9

. 

(**signature**)

mJpKHQE1sNNZ1vBirMq1vg9I_KEloc3_2lD8367jylU



**jwt 생성**

`jwt.sign({ payload }, secretOrPrivateKey, { options })`



**jwt verifying**

`jwt.verify(token, secretOrPrivateKey)`



`{ _id: '1234k22nk2k2', iat: 1553843320, exp: 1553843327 }`

**iat **: issued at

token이 발생한 시간



**exp**

token이 expire되는 시간



### Generating Authentication Token

----

```js
// generate jwt
userSchema.methods.generateAuthToken = async function() {
  const user = this
  const token = jwt.sign({ _id: user.id.toString() }, 'JWT_SECRET')
  user.tokens = user.tokens.concat({ token })
  await user.save()
  
  return token
}

```



routes/user.js/login

```js
const token = await user.generateAuthToken()

res.status(202).send({ user, token })
```

![image-20190329162909526](Node-간단한-보안-1/image-20190329162909526.png)

tokens라는 sub-document 생성을 위해 

models/user.js 에 tokens라는 attribute를 추가해준다.

```js
tokens: [{
    token: {
      type: String,
      required: true,
    }
  }]
```



