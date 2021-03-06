import React, { useState, useEffect, useRef } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import './Profile.css'
import avatar from './../avatar.png'
import Cookies from 'universal-cookie'
import Draw_it from './../Draw_it.png'
import LoginHandler from './LoginHandler'
import ProfileHandler from './ProfileHandler'
import ProfileData from './Elements/ProfileData'
import ChangeData from './ChangeData'
import Card from './UI/Card'
import PostHandler from './PostHandler'
import Postlist from './PostList/PostList'
import FriendName from './UI/FriendName'

const loginHandler = new LoginHandler()
const profileHandler = new ProfileHandler()
const postHandler = new PostHandler()

function Profile() {
    const navigate = useNavigate()
    const cookies = new Cookies()
    const c = cookies.get("sessionId")

    const [username, setUsername] = useState()
    const [email, setEmail] = useState()
    const [myAccount, setMyAccount] = useState(false)
    const [invited, setInvited] = useState(false)
    const [potentialFriend, setPotentialFriend] = useState()
    const [friendsArray, setFriendsArray] = useState([])
    const [blockedArray, setBlockedArray] = useState([])
    const [posts, setPosts] = useState([])
    const [comments, setComments] = useState([])
    let postArray = []
    let IDs = [] //friends' IDs
    const [editing, setEditing] = useState(false)
    const friendName = useRef('')
    const user = useParams()
    const refs = useRef([])

    const edit = () => {
        setEditing(true)
    }

    const finishEditing = () => {
        setEditing(false)
    }

    const logout = () => {
        loginHandler.logout(c).then( () =>
        {
            cookies.remove('sessionId')
            navigate('/login')
            console.log('Wylogowano')
        })
    }


    useEffect((data) => {
        let loggedas = null;
        loginHandler.checkLoginStatus(String(c)).then(
            (res) => {
                console.log(res)
                if (res.data.loggedin)
                {
                    loggedas = res.data.loggedas
                }
                    
            }
        ).then(()=>{
            if(loggedas == null && user.userek == undefined)
            {
                console.log('niezalogowany')
            }
            else if (loggedas == user.userek || user.userek == undefined)
            {
                profileHandler.myprofile(c).then(res => {
                    console.log(res.data)
                    setUsername(res.data.username)
                    setMyAccount(true)
                    setEmail(res.data.email)
                }).then(() => {
                    profileHandler.get_requests_for_you(c).then(res => {
                        console.log(res)
                        if (res.data.requests.length > 0) {
                            setInvited(true)
                            setPotentialFriend(res.data.requests[0].toString())
                            console.log(potentialFriend)
                        }
                    })
                    postHandler.getselfPosts(c).then(
                        res => {
                            console.log(res)
                            for(const el in res.data.posts) {
                                postArray.push(res.data.posts[el])
                            }
                            console.log(postArray)
                            setPosts(res.data.posts)
                            for (let i=0; i<res.data.posts.length; i++) {
                                posts.push(res.data.posts)
                                setComments(posts[i].comments)
                            }
                        }
                    )
                }
                )
            }
            else
            {
                profileHandler.getprofilebyusername(user.userek).then(res => {
                    console.log(res.data)
                    setUsername(res.data.username)
                    
                })
                postHandler.getuserPosts(user.userek).then(res => {
                    setPosts(res.data.posts)
                })
            }
            profileHandler.list_of_friends(c).then(
                res => {
                    console.log(res)
                    setFriendsArray(res.data.friends)
                    console.log(friendsArray)
                }
            ).catch(err => {
                console.log(`Error: ${err}`)
            })
        })
        setTimeout(logout,600000)
    }, [])

    const addFriend = () => {
        profileHandler.requestFriend(c, user.userek).then(res => {
            console.log('OK my friend')
            console.log(res.data)
        }
            
        ).catch(() => console.log('co?? si?? popsu??o'))
        
    }

    const acceptFriend = () => {
        profileHandler.acceptFriend(c, potentialFriend).then(() => {
            console.log('Zaproszenie przyj??te')
        }).catch(err => console.log(err))
    }

    const denyFriend = () => {
        profileHandler.denyFriend(c, potentialFriend).then(() => {
            console.log('Zaproszenie odrzucone')
        }).catch(err => console.log(err))
    }

    const removeFriend = () => {
        profileHandler.removeFriend(c, user.userek).then(() => {
            console.log('Znajomy usuni??ty')
        }).catch(err => console.log(err))
    }

    const blockUser = () => {
        profileHandler.blockUser(c, user.userek).then(() => {
            blockedArray.push(user.userek)
            console.log('U??ytkownik zablokowany')
            console.log(blockedArray)
        }).catch(err => console.log(err))
    }

    const unblockUser = () => {
        profileHandler.unblockUser(c, user.userek).then(() => {
            blockedArray.remove(user.userek)
            console.log('U??ytkownik obblokowany')
            console.log(blockedArray)
        }).catch(err => console.log(err))
    }

    return (
        <div className="allPage">
            <header>
                <div id="logo_of_brand">
                    <Link to="/home" className="preturn">Wr??c do strony g????wnej</Link>
                </div>
            </header>
            <aside>
                <Card>
                    <div id="logo_of_brand">
                        <img src={Draw_it}/>
                    </div>  
                </Card>
                
                <Card>
                    <div className="values">
                        <ul className="list_of_friends">
                            {friendsArray !== null ? friendsArray.map((item) => 
                                <li className="listFriendsElement" key={item.id} ref={profileHandler} onClick={() => {
                                    //console.log(refs[item.id])
                                    //user.userek = friendName.current.children.innerHTML
                                    /*profileHandler.getprofilebyusername().then(res => {
                                        console.log(res.data)
                                        setUsername(res.data.username)
                                })*/}}><FriendName>{item}</FriendName></li>
                            ) : <p>Brak przyjaci????</p>}
                        </ul>
                    </div>
                </Card>

                {invited 
                    ? <Card>
                        <p>{potentialFriend} zaprosi??/a ci?? do znajomych</p>
                        <button onClick={acceptFriend}>Akceptuj zaproszenie</button>
                        <button onClick={denyFriend}>Odrzu?? zaproszenie</button>
                    </Card>: null
                }
            </aside>
            <section>
                
                <div className="profilePosts">
                    <div class="user">
                        {editing 
                            ? <ChangeData email={email} finishEditing={finishEditing}/>
                            : <ProfileData avatar={avatar} 
                                        username={username} 
                                        click={edit} 
                                        myAccount={myAccount} 
                                        addFriend={addFriend} 
                                        removeFriend={removeFriend} 
                                        blockUser={blockUser}
                                        unblockUser={unblockUser}
                                        blockedArray={blockedArray}
                                        friends={friendsArray}/>
                        }
                    </div>
                    <Postlist data={posts}/>
                </div>
            </section>
            
        </div>
    )
}

export default Profile
