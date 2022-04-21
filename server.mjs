import express from "express";
import cors from "cors";
import dialogflow from '@google-cloud/dialogflow';
// import gcHelper from "google-credentials-helper";
import mongoose from 'mongoose'
import { WebhookClient, Card, Suggestion, Image, Payload } from 'dialogflow-fulfillment';
// import {
//     stringToHash,
//     varifyHash
// } from "bcrypt-inzi"
// import jwt from 'jsonwebtoken';
// import cookieParser from 'cookie-parser';


// gcHelper(true);
const sessionClient = new dialogflow.SessionsClient();

const app = express();
app.use(cors())
app.use(express.json())


const PORT = process.env.PORT || 7001;
const SECRET = process.env.SECRET || "12345"

//db setup
mongoose.connect('mongodb+srv://asadalikhan:asadalikhan@cluster0.rhous.mongodb.net/myFirstDatabase?retryWrites=true&w=majority').then(() => console.log("connection succesfull")).catch((error) => console.log(error))




// exports.LogisticsSchema = new mongoose.Schema({
//     FullName: {
//         type: String,
//         required: [true, "Full name required."],

//       },

//     Address1: {
//         type: String,
//         required: [true, "Address required."],
//       },
//     Address2: {
//         type: String,
//       },
//     PhoneNumber1: {
//         type:String,
//         required: [true, "Phone number required."],

//     },
//     PhoneNumber2: {
//         type:String,
//         required: [true, "Phone number required."],

//     },
//     City: {
//         type:String,
//         required: [true, "City required."],
//     }   

// },
// {
//     timestamps:true
// }
// )




const question = mongoose.model('Questions', {
    email: {
        type: String,
        required: true
    },
    depression: {
        type: [String],
        required: true
    },
    anxiety: {
        type: [String],
        required: true
    },
    stress: {
        type: [String],
        required: true
    },
    day: {
        type: Number,
        required: true
    },
    date: {
        type: Date,

    }
}
    // ,
    // {
    //     timestamps:true
    // }
)
const result = mongoose.model('Result', {
    email: {
        type: String,
        required: true
    },
    stress: {
        type: String,
        required: true
    },
    anxiety: {
        type: String,
        required: true
    },
    depression: {
        type: String,
        required: true
    },

    date: {
        type: Date,

    }
})
const response = mongoose.model('Response', {
    email: {
        type: String,
        required: true
    },
    Questionday1: {
        type: [String],
    },
    Questionday2: {
        type: [String],
    },
    Questionday3: {
        type: [String],
    },
    Questionday4: {
        type: [String],
    },
    Questionday5: {
        type: [String],
    },
    Questionday6: {
        type: [String],
    },
    Questionday7: {
        type: [String],
    },
    Answerday1: {
        type: [String],
    },
    Answerday2: {
        type: [String],
    },
    Answerday3: {
        type: [String],
    },
    Answerday4: {
        type: [String],
    },
    Answerday5: {
        type: [String],
    },
    Answerday6: {
        type: [String],
    },
    Answerday7: {
        type: [String],
    },

})



app.post("/talktochatbot", async (req, res) => {

    const projectId = "asad-tvve"
    const sessionId = req.body.sessionId || "session123"
    const query = req.body.text;
    const languageCode = "en-US"

    console.log("query: ", query, req.body);

    // The path to identify the agent that owns the created intent.
    const sessionPath = sessionClient.projectAgentSessionPath(
        projectId,
        sessionId
    );

    // The text query request.
    const request = {
        session: sessionPath,
        queryInput: {
            text: {
                text: query,
                languageCode: languageCode,
            },
        },
    };
    try {
        const responses = await sessionClient.detectIntent(request);
        // console.log("responses: ", responses);
        // console.log("resp: ", responses[0].queryResult.fulfillmentText);    
        res.send({
            text: responses[0].queryResult.fulfillmentText
        });

    } catch (e) {
        console.log("error while detecting intent: ", e)
    }
})
function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
}



const questions = {
    depression: ['Do you have any positive feelings in daily life?The number 0-3 you can choose?',

        'Do you feel difficulty doing things proactively?The number 0-3 you can choose?',

        'Do you have any expectations in daily life?The number 0-3 you can choose?',

        'Do you feel down-hearted and blue?The number 0-3 you can choose?',

        'Do you have a passion for anything?The number 0-3 you can choose?',

        'Do you feel you are a useless person?The number 0-3 you can choose?',

        'Do you feel your life is meaningless?The number 0-3 you can choose?'
    ],
    anxiety: [
        'Are you aware of the dryness of your mouth?The number 0-3 you can choose?',

        'Do you have difficulty breathing?The number 0-3 you can choose?',

        'Have you experienced trembling?The number 0-3 you can choose?',

        'Do you worry about situations in which you might panic and make a fool of yourself?The number 0-3 you can choose?',

        'Are you close to panic?The number 0-3 you can choose?',

        'Do you feel your heartbeat increase?The number 0-3 you can choose?',

        'Do you feel scared without any reason?The number 0-3 you can choose?',

    ],
    stress: [
        'Do you find it hard to calm down?The number 0-3 you can choose?',

        'Would you overreact to something?The number 0-3 you can choose?',

        'Would you use a lot of nervous energy?The number 0-3 you can choose?',

        'Do you feel complex thinking about something negatively inside your mind?The number 0-3 you can choose?',

        'Would you find it hard to relax?The number 0-3 you can choose?',

        'Do you feel angry when people are stopping your jobs?The number 0-3 you can choose?',

        'Are you a sensitive person?The number 0-3 you can choose?',

    ]
}
var counter = 0
var specificQuestions = []
var user_response = []
var value;
app.post("/webhook", async (req, res) => {
    console.log(res.req.body.session)
    // const email = "saima@gmail.com"
    var email = res.req.body.session

    // const result = await response.findOne({ email: email })
    // var sum_depression = parseInt(result.Answerday1[0]) + parseInt(result.Answerday2[0]) + parseInt(result.Answerday3[0]) + parseInt(result.Answerday4[0]) + parseInt(result.Answerday5[0]) + parseInt(result.Answerday6[0]) + parseInt(result.Answerday7[0])
    // console.log("sum_dep", sum_depression)


    const agent = new WebhookClient({ request: req, response: res });

    var responseid;
    var userExist;
    userExist = await question.findOne({ email: email })
    const responseExist = await response.findOne({ email: email })
    if (responseExist) {
        responseid = responseExist._id.toString()

    }
    if (userExist) {
        console.log("exsists")
    } else {
        const table = new question({ email, depression: questions.depression, anxiety: questions.anxiety, stress: questions.stress, day: 1 })
        const table1 = new response({ email })
        table1.save().then(async () => {
            // userExist = await question.findOne({ email: email })
            console.log("user registered successfully"); res.status(200).send('OK')
        }).catch((error) => { console.log(error) })
        table.save().then(async () => {
            userExist = await question.findOne({ email: email })
            const responseExist = await response.findOne({ email: email })
            responseid = responseExist._id.toString()

            console.log("user registered successfully"); res.status(200).send('OK')
        }).catch((error) => { console.log(error) })
    }


    // console.log("userExist", userExist)




    function hi(agent) {
        console.log(`intent  =>  hi`);
        agent.add('what do you feel today?')

    }
    function feeling(agent) {
        console.log(`intent  =>  feeling`);
        agent.add('why do you feel like that? It is due to study, family, peer or romantic?')
    }
    function middle(agent) {
        console.log(`intent  =>  middle`);
        agent.add('why do you feel like that? It is due to study, family, peer or romantic?')
    }
    //family
    function family(agent) {
        console.log(`intent  =>  family`);
        agent.add('What family problem do you have? Conflict? Heavy expetation? Money problem?')
    }
    function conflict(agent) {
        console.log(`intent  =>  conflict`);
        agent.add('Can you tell me more detail about the conflict problem?')

    }
    function childconflict(agent) {
        console.log(`intent  =>  childconflict`);

        agent.add('Oh you may tell your family what you feeling after everyone is calm down. Or you should find a social worker of your school to help for the conflict.Do you have any other family problem?');
    }
    function heavyExpectation(agent) {
        console.log(`intent  => heavyExpectation`);

        agent.add('Can you tell me more about your family expectation?');
    }


    function childheavyexpec(agent) {
        console.log(`intent  => childheavyexpec`);

        agent.add('Oh, you may tell your family how your feeling about this, and set a more appropriate target that you can think you can meet together');
        agent.add('Do you have any other family problem?')
    }

    function moneyProblem(agent) {
        console.log(`intent  => moneyProblem`);

        agent.add('Can you tell me more?');
    }
    function childMoneyProblem(agent) {
        console.log(`intent  => childMoneyProblem`);

        agent.add('I may not solve your family finance problem, but you may be more thoughtful for your family now. You can make a good money in the future and improve that');
        agent.add('Do you have any other family problem?')
    }
    //study
    function study(agent) {
        console.log(`intent  =>  study`);
        agent.add('What problem do you face in studying? Homework or test/exam?')
    }
    function homework(agent) {
        console.log(`intent  =>  homework`);
        agent.add('heavy or difficult')
    }
    function test(agent) {
        console.log(`intent  =>  test`);
        agent.add('Good result or bad result')
    }
    function childHomework(agent) {
        console.log(`intent  =>  childHomework`);
        agent.add('May be you should tell it to your teacher / Ask your teacher / take a extra class')
    }
    function childGood(agent) {
        console.log(`intent  =>  childGood`);
        agent.add('Keep your good work')
    }
    function childBad(agent) {
        console.log(`intent  =>  childBad`);
        agent.add('take extra class / pay more attendation on lesson')
    }

    function mainIntentOfAllQuestions(agent) {
        console.log(`intent  =>  mainIntentOfAllQuestions`);
        agent.add('say no to start 21 questions')
    }

    const mainIntentOfAllQuestionsno = async (agent) => {
        console.log(`intent  =>  mainIntentOfAllQuestionsno`);


        const datesAreOnSameDay = (first, second) => {
            const then = second
            const now = first

            const msBetweenDates = Math.abs(then.getTime() - now.getTime());

            // 👇️ convert ms to hours                  min  sec   ms
            const hoursBetweenDates = msBetweenDates / (60 * 60 * 1000);

            console.log(hoursBetweenDates);

            if (hoursBetweenDates < 24) {
                return true
            } else {
                return false
            }
            // if (
            //     first.getFullYear() === second.getFullYear() &&
            //     first.getMonth() === second.getMonth() &&
            //     first.getDate() === second.getDate()) {
            //     return true
            // }
            // else { return false }

        }
        let today = new Date()
        if (userExist.date) {
            if (datesAreOnSameDay(today, userExist.date)) {
                agent.add("you are already responded today")

            }
            else {
                if (userExist.day < 8) {
                    value = randomIntFromInterval(0, userExist.depression.length - 1)
                    specificQuestions.push(userExist.depression[value])
                    specificQuestions.push(userExist.anxiety[value])
                    specificQuestions.push(userExist.stress[value])
                    console.log("specificQuestionss", specificQuestions)
                    // userExist.depression.splice(value, 1)
                    // userExist.anxiety.splice(value, 1)
                    // userExist.stress.splice(value, 1)
                    // console.log("userExist", userExist)
                    ++counter;
                    agent.add(specificQuestions[0])
                    const id = userExist._id.toString()
                    // question.findByIdAndUpdate(id, { depression: userExist.depression, anxiety: userExist.anxiety, stress: userExist.stress, day: userExist.day + 1, date: Date.now() }, { new: true }, (err, data) => {
                    //     if (err) {
                    //         console.log(err)
                    //     } else {
                    //         console.log("data", data)

                    //     }
                    // })

                }
            }
        } else {
            if (userExist.day < 7) {
                value = randomIntFromInterval(0, userExist.depression.length - 1)
                specificQuestions.push(userExist.depression[value])
                specificQuestions.push(userExist.anxiety[value])
                specificQuestions.push(userExist.stress[value])
                console.log("specificQuestionss", specificQuestions)
                //    userExist= userExist.depression.splice(value, 1)
                //     userExist=userExist.anxiety.splice(value, 1)
                //    userExist= userExist.stress.splice(value, 1)
                //     console.log("userExist", userExist)
                ++counter

                agent.add(specificQuestions[0])
                // const id = userExist._id.toString()
                // question.findByIdAndUpdate(id, { depression: userExist.depression, anxiety: userExist.anxiety, stress: userExist.stress, day: userExist.day + 1, date: Date.now() }, { new: true }, (err, data) => {
                //     if (err) {
                //         console.log(err)
                //     } else {
                //         console.log(data)


                //     }
                // })

            }
        }








    }
    // specificQuestions = ['Do you have any expectations in daily life?The number 0-3 you can choose?',
    //     'Have you experienced trembling?The number 0-3 you can choose?',
    //     'Would you use a lot of nervous energy?The number 0-3 you can choose?']
    const answer1 = async (agent) => {
        if (specificQuestions.length > 0) {


            const number = agent.parameters.number;
            if (number >-1 && number <4) {
                
                user_response.push(number)
                console.log(user_response)

                console.log(`intent  =>  answer1`);
                // agent.add('sjbdljbdjbdbjldb')
                // console.log(counter)
                // agent.add(specificQuestions[1])

                if (counter == 1) {
                    agent.add(specificQuestions[1])
                    ++counter
                }
                else if (counter == 2) {
                    agent.add(specificQuestions[2])
                    ++counter

                }
                else {
                    const day = userExist.day
                    console.log("day", day)
                    if (userExist.day != 7) {
                        agent.add("thank you for you feedback")

                    } else if (userExist.day == 7) {
                        agent.add("Your all responses of this week is recorded.")
                        agent.add("Respond with 'give suggestion' to take advice")

                    }


                    try {


                        if (day == 1) {
                            response.findByIdAndUpdate(responseid, { Questionday1: [specificQuestions[0], specificQuestions[1], specificQuestions[2]], Answerday1: [user_response[0], user_response[1], user_response[2]] }, { new: true }, (err, data) => {
                                if (err) {
                                    console.log(err)
                                } else {
                                    specificQuestions = []
                                    user_response = []
                                    counter = 0
                                    // console.log(data)
                                }
                            })
                            const id = userExist._id.toString()
                            userExist.depression.splice(value, 1)
                            userExist.anxiety.splice(value, 1)
                            userExist.stress.splice(value, 1)
                            console.log("userExist", userExist)
                            await question.findByIdAndUpdate(id, { depression: userExist.depression, anxiety: userExist.anxiety, stress: userExist.stress, day: userExist.day + 1, date: Date.now() }, { new: true }, (err, data) => {
                                if (err) {
                                    console.log(err)
                                } else {
                                    console.log(data)


                                }
                            })
                        }

                        else if (day == 2) {
                            response.findByIdAndUpdate(responseid, { Questionday2: [specificQuestions[0], specificQuestions[1], specificQuestions[2]], Answerday2: [user_response[0], user_response[1], user_response[2]] }, { new: true }, (err, data) => {
                                if (err) {
                                    console.log(err)
                                } else {
                                    specificQuestions = []
                                    user_response = []
                                    counter = 0
                                    // console.log(data)
                                }
                            })
                            const id = userExist._id.toString()
                            userExist.depression.splice(value, 1)
                            userExist.anxiety.splice(value, 1)
                            userExist.stress.splice(value, 1)
                            console.log("userExist", userExist)
                            await question.findByIdAndUpdate(id, { depression: userExist.depression, anxiety: userExist.anxiety, stress: userExist.stress, day: userExist.day + 1, date: Date.now() }, { new: true }, (err, data) => {
                                if (err) {
                                    console.log(err)
                                } else {
                                    console.log(data)


                                }
                            })
                        }
                        else if (day == 3) {
                            response.findByIdAndUpdate(responseid, { Questionday3: [specificQuestions[0], specificQuestions[1], specificQuestions[2]], Answerday3: [user_response[0], user_response[1], user_response[2]] }, { new: true }, (err, data) => {
                                if (err) {
                                    console.log(err)
                                } else {
                                    specificQuestions = []
                                    user_response = []
                                    counter = 0
                                    // console.log(data)
                                }
                            })
                            const id = userExist._id.toString()
                            userExist.depression.splice(value, 1)
                            userExist.anxiety.splice(value, 1)
                            userExist.stress.splice(value, 1)
                            console.log("userExist", userExist)
                            await question.findByIdAndUpdate(id, { depression: userExist.depression, anxiety: userExist.anxiety, stress: userExist.stress, day: userExist.day + 1, date: Date.now() }, { new: true }, (err, data) => {
                                if (err) {
                                    console.log(err)
                                } else {
                                    console.log(data)


                                }
                            })
                        }
                        else if (day == 4) {
                            response.findByIdAndUpdate(responseid, { Questionday4: [specificQuestions[0], specificQuestions[1], specificQuestions[2]], Answerday4: [user_response[0], user_response[1], user_response[2]] }, { new: true }, (err, data) => {
                                if (err) {
                                    console.log(err)
                                } else {
                                    specificQuestions = []
                                    user_response = []
                                    counter = 0
                                    // console.log(data)
                                }
                            })
                            const id = userExist._id.toString()
                            userExist.depression.splice(value, 1)
                            userExist.anxiety.splice(value, 1)
                            userExist.stress.splice(value, 1)
                            console.log("userExist", userExist)
                            await question.findByIdAndUpdate(id, { depression: userExist.depression, anxiety: userExist.anxiety, stress: userExist.stress, day: userExist.day + 1, date: Date.now() }, { new: true }, (err, data) => {
                                if (err) {
                                    console.log(err)
                                } else {
                                    console.log(data)


                                }
                            })
                        }
                        else if (day == 5) {
                            response.findByIdAndUpdate(responseid, { Questionday5: [specificQuestions[0], specificQuestions[1], specificQuestions[2]], Answerday5: [user_response[0], user_response[1], user_response[2]] }, { new: true }, (err, data) => {
                                if (err) {
                                    console.log(err)
                                } else {
                                    specificQuestions = []
                                    user_response = []
                                    counter = 0
                                    // console.log(data)
                                }
                            })
                            const id = userExist._id.toString()
                            userExist.depression.splice(value, 1)
                            userExist.anxiety.splice(value, 1)
                            userExist.stress.splice(value, 1)
                            console.log("userExist", userExist)
                            await question.findByIdAndUpdate(id, { depression: userExist.depression, anxiety: userExist.anxiety, stress: userExist.stress, day: userExist.day + 1, date: Date.now() }, { new: true }, (err, data) => {
                                if (err) {
                                    console.log(err)
                                } else {
                                    console.log(data)


                                }
                            })
                        }
                        else if (day == 6) {
                            response.findByIdAndUpdate(responseid, { Questionday6: [specificQuestions[0], specificQuestions[1], specificQuestions[2]], Answerday6: [user_response[0], user_response[1], user_response[2]] }, { new: true }, (err, data) => {
                                if (err) {
                                    console.log(err)
                                } else {
                                    specificQuestions = []
                                    user_response = []
                                    counter = 0
                                    // console.log(data)
                                }
                            })
                            const id = userExist._id.toString()
                            userExist.depression.splice(value, 1)
                            userExist.anxiety.splice(value, 1)
                            userExist.stress.splice(value, 1)
                            console.log("userExist", userExist)
                            await question.findByIdAndUpdate(id, { depression: userExist.depression, anxiety: userExist.anxiety, stress: userExist.stress, day: userExist.day + 1, date: Date.now() }, { new: true }, (err, data) => {
                                if (err) {
                                    console.log(err)
                                } else {
                                    console.log(data)


                                }
                            })
                        }
                        else if (day == 7) {
                            const id = userExist._id.toString()
                            console.log("del", id)
                            question.findByIdAndRemove(id, (err, data) => {
                                if (!err) {
                                    console.log("Student successfully deleted")
                                } else {
                                    console.log("No student with this id exists")
                                }
                            })

                            var sum_depression;
                            var sum_anxiety;
                            var sum_stress;
                            await response.findByIdAndUpdate(responseid, { Questionday7: [specificQuestions[0], specificQuestions[1], specificQuestions[2]], Answerday7: [user_response[0], user_response[1], user_response[2]] }, { new: true }, (err, data) => {
                                if (err) {
                                    console.log(err)
                                } else {
                                    specificQuestions = []
                                    user_response = []
                                    counter = 0
                                    console.log("day 7 response", data)
                                    sum_depression = parseInt(data.Answerday1[0]) + parseInt(data.Answerday2[0]) + parseInt(data.Answerday3[0]) + parseInt(data.Answerday4[0]) + parseInt(data.Answerday5[0]) + parseInt(data.Answerday6[0]) + parseInt(data.Answerday7[0])
                                    sum_anxiety = parseInt(data.Answerday1[1]) + parseInt(data.Answerday2[1]) + parseInt(data.Answerday3[1]) + parseInt(data.Answerday4[1]) + parseInt(data.Answerday5[1]) + parseInt(data.Answerday6[1]) + parseInt(data.Answerday7[1])
                                    sum_stress = parseInt(data.Answerday1[2]) + parseInt(data.Answerday2[2]) + parseInt(data.Answerday3[2]) + parseInt(data.Answerday4[2]) + parseInt(data.Answerday5[2]) + parseInt(data.Answerday6[2]) + parseInt(data.Answerday7[2])
                                    const table2 = new result({ email, depression: sum_depression.toString(), anxiety: sum_anxiety.toString(), stress: sum_stress.toString() })
                                    table2.save().then(() => {
                                        console.log("student registered successfully");
                                    }).catch((error) => { console.log(error) })
                                    console.log((`Your sum of depression is ${sum_depression}. Your sum of anxiety is ${sum_anxiety}. Your sum of stress is ${sum_stress}. `))


                                }
                            })

                        }







                    } catch (err) {
                        console.log(err)
                    }

                }

            } else {
                agent.add("Response between 0 to3 ")



            }



            // }


        } else {
            agent.add("You are already responded. You can send another response tommorrow")
        }


    }

    const answer1yes = async (agent) => {
        console.log(`intent  =>  answer1yes`);
        const res = await result.findOne({ email: email })
        console.log(res)
        if (res) {
            var res_dep;
            var res_anx;
            var res_stress;
            if (res.depression > 16) {
                res_dep = "serious"
            }
            else if (res.depression > 9) {
                res_dep = "average"
            }
            else if (res.depression > 4) {
                res_dep = "light"
            }
            else if (res.depression > -1) {
                res_dep = "none"
            }


            if (res.stress > 16) {
                res_stress = "serious"
            }
            else if (res.stress > 9) {
                res_stress = "average"
            }
            else if (res.stress > 4) {
                res_stress = "light"
            }
            else if (res.stress > -1) {
                res_stress = "none"
            }



            if (res.anxiety > 16) {
                res_anx = "serious"
            }
            else if (res.anxiety > 9) {
                res_anx = "average"
            }
            else if (res.anxiety > 4) {
                res_anx = "light"
            }
            else if (res.anxiety > -1) {
                res_anx = "none"
            }

            agent.add(`Your depression is ${res.depression} which is ${res_dep} `)
            agent.add(`Your depression is ${res.stress} which is ${res_stress} `)
            agent.add(`Your depression is ${res.anxiety} which is ${res_anx} `)


        } else {
            agent.add('You have not completed your responses of this week ')
        }
    }


    const peer = async (agent) => {
        console.log(`intent  =>  peer`);
        agent.add("Do you have friend?")
        agent.add('Respond with I have friend  or I do not have friend')

    }
    const peercustom = async (agent) => {
        console.log(`intent  =>  peercustom`);
        agent.add("It's a good news")
        agent.add("Do you have someone to talk to?")
        agent.add('Respond with I have someone  or I do not have someone')

    }
    const peercustomno = async (agent) => {
        console.log(`intent  =>  peercustomno`);
        agent.add("It's sad to hear this, can I be your friend")
        agent.add("Do you have someone to talk to?")
        agent.add('Respond with I have someone  or I do not have someone')

    }
    const peercustomcustom = async (agent) => {
        console.log(`intent  =>  peercustomcustom`);
        agent.add("It's a good news")
        agent.add("Do you have any other problem?")
    }
    const peercustomcustomno = async (agent) => {
        console.log(`intent  =>  peercustomcustomno`);
        agent.add("It's sad to hear this. Iam hear to listen to you")

        agent.add("Do you have any other problem?")
    }
    const romantic = async (agent) => {
        console.log(`intent  =>  romantic`);
        agent.add("What happened in your relationship?argument? broke up not smooth?")

    }
    const argument = async (agent) => {
        console.log(`intent  =>  argument`);
        agent.add("Can you tell me more about the argument?")

    }
    const childArgument = async (agent) => {
        console.log(`intent  =>  childArgument`);
        agent.add("I am sure you guys will work it out. Argument are quite normal for couples, since it shows you guys are caring eachother, right?")
        agent.add("Do you have any other problem?")


    }
    const childBroke = async (agent) => {
        console.log(`intent  =>  childBroke`);
        agent.add("It is so sad to hear that happened. I can listen to you all day long. I think you should meet with your friends and they would make you feel better?")
        agent.add("Do you have any other problem?")


    }
    const broke = async (agent) => {
        console.log(`intent  =>  broke`);
        agent.add("Can you tell me more about the broke up?")


    }
    function grandHome(agent) {
        console.log(`intent  =>  grandHomework`);
        agent.add('Do you have any other problem about peer, family or romantic?')
    }


    function fallback(agent) {
        agent.add('Woah! Its getting a little hot in here.');
        agent.add(`I didn't get that, can you try again?`);
    }

    let intentMap = new Map(); // Map functions to Dialogflow intent names


    intentMap.set('hi', hi);
    intentMap.set('feeling', feeling);
    intentMap.set('family', family);
    intentMap.set('conflict', conflict);
    intentMap.set('mainIntentOfAllQuestions', mainIntentOfAllQuestions);
    intentMap.set('mainIntentOfAllQuestionsno', mainIntentOfAllQuestionsno);
    intentMap.set('answer1', answer1);
    intentMap.set('study', study);
    intentMap.set('homework', homework);
    intentMap.set('test', test);
    intentMap.set('childHomework', childHomework);
    intentMap.set('grandHome', grandHome);
    intentMap.set('childGood', childGood);
    intentMap.set('childBad', childBad);
    intentMap.set('childconflict', childconflict);
    intentMap.set('answer1yes', answer1yes);
    intentMap.set('heavyExpectation', heavyExpectation);
    intentMap.set('childheavyexpec', childheavyexpec);

    intentMap.set('moneyProblem', moneyProblem);

    intentMap.set('childMoneyProblem', childMoneyProblem);
    intentMap.set('peer', peer);
    intentMap.set('peercustom', peercustom);
    intentMap.set('peercustomno', peercustomno);

    intentMap.set('peercustomcustom', peercustomcustom);
    intentMap.set('peercustomcustomno', peercustomcustomno);
    intentMap.set('romantic', romantic);
    intentMap.set('argument', argument);
    intentMap.set('childArgument', childArgument);
    intentMap.set('childBroke', childBroke);
    intentMap.set('broke', broke);
    intentMap.set('middle', middle);







    // intentMap.set('childChildGood', childChildGood);










    intentMap.set('fallback', fallback);







    agent.handleRequest(intentMap);

})




app.get("/profile", (req, res) => {
    res.send("here is your profile");
})
app.get("/about", (req, res) => {
    res.send("some information about me");
})

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
});















