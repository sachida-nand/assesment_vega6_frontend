import React, { useState, useEffect } from "react";
import { deleteData, getData, postFormData, putFormData } from "../services/httpHandler";
import { toast } from "react-toastify";
import config from "../config/config"

function Blog() {
    const [showModal, setShowModal] = useState(false);
    const [userData, setUserData] = useState(null);
    const [isEdit, setEdit] = useState(false);
    const [blogId, setBlogId] = useState(null)
    const [formData, setFormData] = useState({
        blog_title: "",
        blog_sescriptions: "",
        blog_img: ""
    });
    const [blogs, setBlogs] = useState([]);

    useEffect(() => {
        fetchAllBlogs();
        fetchProfile();
        console.log(userData);
    }, []);

    const fetchProfile = async () => {
        try {
            const authData = localStorage.getItem("authToken");
            if (!authData) {
                return;
            }
            const user = JSON.parse(authData).data;
            setUserData(user);

            console.log(userData);

        } catch (error) {
            console.error("Error fetching profile:", error);
        }
    };

    const fetchAllBlogs = async () => {
        try {
            const response = await getData("/blogs");
            setBlogs(response.data.data);
        } catch (error) {
            console.error("Error fetching blogs:", error);
            toast.error("Failed to load blogs");
        }
    };

    const handleChange = (e) => {
        if (e.target.name === "blog_img") {
            setFormData({ ...formData, blog_img: e.target.files[0] });
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        let response = null;
        if (setEdit && blogId) {
            response = await putFormData(`/blogs/${blogId}`, formData);
        } else {
            response = await postFormData("/blogs", formData);
        }

        if (response && response.data.status) {
            toast.success(response.data.message);
            setShowModal(false);
            setFormData({ blog_title: "", blog_sescriptions: "", blog_img: "" });
            fetchAllBlogs();
        }
    };

    const handleCreate = async () => {
        setEdit(false)
        setBlogId(null)
        setShowModal(true)
    }

    const handleLogout = async () => {
        localStorage.removeItem("authToken");
        window.location.href = "/";
    }

    const handleEdit = (blog) => {
        setFormData({
            blog_title: blog.blog_title,
            blog_sescriptions: blog.blog_sescriptions,
        });
        setBlogId(blog.id)
        setEdit(true)
        setShowModal(true);
    };

    const handleDelete = async (blogId) => {
        if (!window.confirm("Are you sure you want to delete this blog?")) return;

        try {
            const response = await deleteData(`/blogs/${blogId}`);
            if (response.data.status) {
                toast.success(response.data.message);
                fetchAllBlogs();
            }
        } catch (error) {
            console.error("Error deleting blog:", error);
            toast.error("Failed to delete blog.");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
            <div className="flex items-center justify-between w-full mb-6">
                <div>
                    <h1 className="text-3xl font-bold">Blog Page</h1>
                </div>
                <div>
                    <button
                        onClick={() => handleCreate()}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-indigo-500 mt-2"
                    >
                        Create Blog
                    </button>
                </div>
                <div>
                    <button
                        onClick={() => handleLogout()}
                        className="bg-red-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-red-500 mt-2"
                    >
                        Logout
                    </button>
                </div>
                <div className="flex items-center space-x-4">
                    <span className="text-lg font-medium"> {userData ? userData.name : ""}</span>
                    <img
                        src={`${config.imgUrl}${userData ? userData.profile_img : ""}`}
                        alt="Profile"
                        className="w-12 h-12 rounded-full border-2 border-gray-300"
                    />
                </div>
            </div>


            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-xl font-bold mb-4">Create a Blog Post</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-900">Blog Title</label>
                                <input
                                    type="text"
                                    name="blog_title"
                                    value={formData.blog_title}
                                    onChange={handleChange}
                                    required
                                    className="w-full p-2 border rounded-md"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-900">Description</label>
                                <textarea
                                    name="blog_sescriptions"
                                    value={formData.blog_sescriptions}
                                    onChange={handleChange}
                                    required
                                    className="w-full p-2 border rounded-md"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-900">Image</label>
                                <input
                                    type="file"
                                    name="blog_img"
                                    onChange={handleChange}
                                    required={!isEdit ? true : false}
                                    className="w-full p-2 border rounded-md"
                                />
                            </div>
                            <div className="flex justify-end space-x-2">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="bg-gray-400 px-4 py-2 rounded-md"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-indigo-600 text-white px-4 py-2 rounded-md"
                                >
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="mt-8 w-full max-w-3xl">
                <h2 className="text-2xl font-semibold mb-4">Recent Blogs</h2>
                {blogs.length === 0 ? (
                    <p className="text-gray-500">No blogs available. Create one!</p>
                ) : (
                    blogs.map((blog) => (
                        <div key={blog.id} className="bg-white p-4 rounded-md shadow-md mb-4">
                            <img src={`${config.imgUrl}${blog.blog_img}`} alt={blog.blog_title} className="w-full h-64 object-cover rounded-md mb-4" />

                            <h3 className="text-xl font-bold">{blog.blog_title}</h3>
                            <p className="text-gray-700">{blog.blog_sescriptions}</p>
                            <p className="text-gray-400 text-sm">Posted on: {new Date(blog.createdAt).toLocaleDateString()}</p>

                            {/* Buttons for View, Edit, and Delete */}
                            <div className="mt-4 flex space-x-2">
                                <button
                                    className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600"
                                    onClick={() => handleView(blog)}
                                >
                                    View
                                </button>
                                <button
                                    className="bg-yellow-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-yellow-600"
                                    onClick={() => handleEdit(blog)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="bg-red-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-red-600"
                                    onClick={() => handleDelete(blog.id)}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

        </div>
    );
}

export default Blog;
