import React, { useState, useEffect } from "react";
import { supabase } from "@backend/services/supabaseClient";
import { toast } from "react-toastify";

const CreateTask = () => {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        dueDate: "",
        priority: "Low",
        assigned_to: '',
        category: ''
    });

    const [employees, setEmployees] = useState([]);
    const [formLoading, setFormLoading] = useState(false);
    const [fetchError, setFetchError] = useState(null);
    const [fetchLoading, setFetchLoading] = useState(true);

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('id, name')
                    .neq('role', 'admin');

                if (error) throw error;
                setEmployees(data || []);
            } catch (err) {
                setFetchError(err);
                console.error('Data fetch error');
            } finally {
                setFetchLoading(false);
            }
        };
        fetchEmployees();
    }, []);

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setFormLoading(true);

        if (!formData.title) {
            toast.error("Title is required.");
            setFormLoading(false);
            return;
        }

        const today = new Date().toISOString().split("T")[0];
        if (formData.dueDate && formData.dueDate < today) {
            toast.error("Due date must be today or a future date.");
            setFormLoading(false);
            return;
        }

        try {
            const { data: userData, error: userError } = await supabase.auth.getUser();
            if (userError) throw userError;
            const user = userData?.user;

            if (!user) throw new Error("You must be logged in to create a task.");

            const { data, error } = await supabase
                .from("tasks")
                .insert({
                    title: formData.title.trim(),
                    description: formData.description.trim(),
                    due_date: formData.dueDate,
                    priority: formData.priority,
                    user_id: user.id,
                    assigned_to: formData.assigned_to,
                    category: formData.category
                })
                .select()
                .single();

            if (error) throw error;

            if (!data) {
                toast.error("Task creation failed.");
                return;
            }

            toast.success("Task created successfully!");
            setFormData({
                title: "",
                description: "",
                dueDate: "",
                priority: "Low",
                assigned_to: "",
                category: ""
            });
        } catch (error) {
            toast.error(error.message || "An unexpected error occurred.");
            console.error("Error creating task:", error);
        } finally {
            setFormLoading(false);
        }
    };

    if (fetchError) return <div className="p-4 text-red-500">{fetchError}</div>;
    if (fetchLoading) return <div className="p-4 text-gray-600">Loading...</div>;

    return (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-3xl shadow-lg border border-gray-200">
            <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Create a New Task</h2>

            <form onSubmit={handleFormSubmit} className="space-y-5">
                {[
                    { label: 'Title', name: 'title', type: 'text', placeholder: 'Enter task title' },
                    { label: 'Due Date', name: 'dueDate', type: 'date' },
                ].map(({ label, name, type, placeholder }) => (
                    <div key={name}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                        <input
                            type={type}
                            name={name}
                            value={formData[name]}
                            onChange={handleFormChange}
                            placeholder={placeholder}
                            className="w-full px-4 py-2 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                            required={name === 'title' || name === 'dueDate'}
                            disabled={formLoading}
                        />
                    </div>
                ))}

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleFormChange}
                        rows="4"
                        placeholder="Describe the task"
                        className="w-full px-4 py-2 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                        <select
                            name="priority"
                            value={formData.priority}
                            onChange={handleFormChange}
                            className="w-full px-3 py-2 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                        >
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleFormChange}
                            required
                            disabled={formLoading}
                            className="w-full px-3 py-2 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                        >
                            <option value="">Select a category</option>
                            <option value="dev">Development</option>
                            <option value="design">Design</option>
                            <option value="marketing">Marketing</option>
                            <option value="sales">Sales</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Assigned to</label>
                    <select
                        name="assigned_to"
                        value={formData.assigned_to}
                        onChange={handleFormChange}
                        required
                        disabled={formLoading}
                        className="w-full px-3 py-2 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                    >
                        <option value="">Select an employee</option>
                        {employees.map(emp => (
                            <option key={emp.id} value={emp.id}>
                                {emp.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                    <button
                        type="button"
                        onClick={() => setFormData({
                            title: "", description: "", dueDate: "", priority: "Low", assigned_to: "", category: ""
                        })}
                        className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 transition-all"
                        disabled={formLoading}
                    >
                        Reset
                    </button>
                    <button
                        type="submit"
                        className="px-6 py-2 rounded-xl text-white bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 shadow-md transition-all disabled:opacity-60"
                        disabled={formLoading}
                    >
                        {formLoading ? "Creating..." : "Create Task"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateTask;
