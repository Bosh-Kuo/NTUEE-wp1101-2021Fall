import express from 'express'
import Post from '../models/post'
import moment from 'moment'

const router = express.Router()

// TODO 2-(1): create the 1st API (/api/allPosts)
router.get('/allPosts', async (req, res) => {
    try {
        const posts = await Post.find().sort({ timestamp: 1 })
        // console.log(posts)
        if (posts.length) {
            res.status(200).send(
                {
                    message: 'success',
                    data: posts
                }
            );
        }
        else {
            throw new Error('Something Wrong !')
        }

    } catch (error) {
        console.error(err.name + ' ' + err.message)
        res.status(403).send(
            {
                message: 'error',
                data: null
            }
        )
    }
})

// TODO 3-(1): create the 2nd API (/api/postDetail)
router.get('/postDetail', async (req, res) => {
    try {
        // console.log(posts)
        const postId = req.query.pid
        const post = await Post.findOne({ postId: postId })
        if (postId) {
            res.status(200).send(
                {
                    message: 'success',
                    data: post
                }
            );
        }
        else {
            throw new Error('Something Wrong !')
        }

    } catch (error) {
        console.error(err.name + ' ' + err.message)
        res.status(403).send(
            {
                message: 'error',
                data: null
            }
        )
    }
})
// TODO 4-(1): create the 3rd API (/api/newPost)
router.post('/newPost', async (req, res) => {
    try {
        // console.log(posts)
        const postId = req.body.postId
        const title = req.body.title
        const content = req.body.content
        const timestamp = req.body.timestamp

        const newPost = new Post({ postId: postId, title: title, content: content, timestamp: timestamp })
        await newPost.save()
        if (newPost) {
            res.status(200).send(
                {
                    message: 'success',
                }
            );
        }
        else {
            throw new Error('Something Wrong !')
        }

    } catch (error) {
        console.error(err.name + ' ' + err.message)
        res.status(403).send(
            {
                message: 'error',
            }
        )
    }
})
// TODO 5-(1): create the 4th API (/api/post)
router.delete('/post', async (req, res) => {
    try {
        // console.log(posts)
        const postId = req.query.pid

        // const newPost = new Post({ postId: postId, title: title, content: content, timestamp: timestamp })
        
        if (postId) {
            await Post.deleteOne({postId: postId})
            res.status(200).send(
                {
                    message: 'success',
                }
            );
        }
        else {
            throw new Error('Something Wrong !')
        }

    } catch (error) {
        console.error(err.name + ' ' + err.message)
        res.status(403).send(
            {
                message: 'error',
            }
        )
    }
})
export default router