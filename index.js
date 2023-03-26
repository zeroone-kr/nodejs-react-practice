const express = require('express')
const app = express()
const port = 5000
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const {User } = require('./model/User')

const config = require('./config/key')
//application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended:true}))

//application/json
app.use(bodyParser.json())

mongoose.connect(config.mongoURI,{
    
}).then(()=>console.log('MongoDB Connected...'))
.catch(err => console.log(err))


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/register', async (req, res)=>{
  //회원가입시 필요 정보를 client에서 가져오면
  //데이터베이스에 삽입한다

  //body parser를 통해 body에 담긴 정보를 가져온다
  const user = new User(req.body)

  //mongoDB 메서드, user모델에 저장
  const result = await user.save().then(()=>{
    res.status(200).json({
      success: true
    })
  }).catch((err)=>{
    res.json({ success: false, err })
  })
})


app.post('/login',(req,res)=>{
    //요청된 이메일을 데이터베이스에서 있는지 찾는다.
    User.findOne({email: req.body.email}, (err, user)=>{
        if(!user){
            return res.json({
                loginSuccess: false,
                message: "제공된 이메일에 해당하는 유저가 없습니다."
            })
        }

        //요청된 이메일이 데이터베이스에 있단면 비밀번호가 맞는 비밀번호인지 확인
        user.conparePassword(req.body.password, (err, isMatch) => {
            if(!isMatch)
            return res.json({loginSuccess:false, message:"비밀번호가 틀렸습니다."})

            //비밀번호까지 맞다면 토큰을 생성
            user.generateToken((err,user) => {

            })
        })
    })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

