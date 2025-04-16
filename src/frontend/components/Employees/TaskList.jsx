import { toast } from "react-toastify/unstyled";
import { useEffect, useState } from "react";
import { supabase } from "../../../backend/services/supabaseClient";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState(null); 

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError) {
          throw userError;
        }

        if (!user) {
          throw new Error('User not authenticated');
        }

        console.log('Current user ID:', user.id);

        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (profileError) {
          throw profileError;
        }

        console.log('User role:', profile.role);
        setUserRole(profile.role); 

        let query = supabase
          .from('tasks')
          .select(`
            id,
            title,
            description,
            due_date,
            priority,
            category,
            status,
            assigned_to,
            profiles!tasks_assigned_to_fkey (name)
          `)
          .order('due_date', { ascending: true });

        if (profile.role !== 'admin') {
          console.log('Fetching tasks for employee with assigned_to:', user.id);
          query = query.eq('assigned_to', user.id);
        } else {
          console.log('Fetching tasks for admin with user_id:', user.id);
          query = query.eq('user_id', user.id);
        }

        const { data, error } = await query;

        if (error) {
          throw error;
        }

        console.log('Fetched tasks:', data);

        setTasks(data || []);
      } catch (err) {
        console.error('Error fetching tasks:', err);
        setError(err.message || 'An error occurred while fetching tasks');
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase().trim()) {
      case 'high':
        return 'bg-red-100 border-red-200';
      case 'medium':
        return 'bg-emerald-50 border-emerald-200';
      case 'low':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getPriorityBadgeColor = (priority) => {
    switch (priority?.toLowerCase().trim()) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-emerald-100 text-emerald-800';
      case 'low':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status?.toLowerCase().trim()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-emerald-100 text-emerald-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ status: newStatus })
        .eq('id', taskId);

      if (error) {
        throw error;
      }

      const { data: updatedTasks, error: fetchError } = await supabase
        .from('tasks')
        .select(`
          id,
          title,
          description,
          due_date,
          priority,
          category,
          status,
          assigned_to,
          profiles!tasks_assigned_to_fkey (name)
        `)
        .eq('assigned_to', (await supabase.auth.getUser()).data.user.id)
        .order('due_date', { ascending: true });

      if (fetchError) {
        throw fetchError;
      }

      setTasks(updatedTasks || []);
      toast.success(`Task status updated to ${newStatus}`);
    } catch (err) {
      console.error('Error updating task status:', err);
      setError(err.message || 'Failed to update task status');
      toast.error('Failed to update task status');
    }
  };

  if (loading) {
    return <div className="p-6 text-gray-600">Loading tasks...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }

  if (tasks.length === 0) {
    return <div className="p-6 text-gray-600">No Tasks Found...</div>;
  }

  return (
    <div className="mt-1 mx-2 w-full">
      <h3 className="text-2xl font-semibold mb-6 text-gray-800">Task List</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.map((task, index) => (
          <div
            key={index}
            className={`p-3 w-[25rem] rounded-xl shadow-md border ${getPriorityColor(task.priority)} transition-all hover:shadow-lg hover:-translate-y-1 duration-200`}
          >
            <div className="flex justify-between items-start mb-4">
              <span className={`text-xs font-semibold uppercase px-3 py-1 rounded-full ${getPriorityBadgeColor(task.priority)}`}>
                {task.priority}
              </span>
              <span className="text-sm text-gray-500 italic">
                {new Date(task.due_date).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </span>
            </div>
            <h4 className="text-xl font-semibold mb-3 text-gray-800">{task.title}</h4>
            <p className="text-sm text-gray-600 mb-4">{task.description}</p>
            <div className="space-y-2">
              <p className="text-sm">
                <strong className="font-medium text-gray-700">Category:</strong>{' '}
                <span className="text-gray-600">{task.category || 'N/A'}</span>
              </p>
              <p className="text-sm">
                <strong className="font-medium text-gray-700">Assigned to:</strong>{' '}
                <span className="text-gray-600">{task.profiles?.name || 'Unknown'}</span>
              </p>
              <p className="text-sm">
                <strong className="font-medium text-gray-700">Status:</strong>{' '}
                <span className={`text-xs font-semibold uppercase px-3 py-1 rounded-full ${getStatusBadgeColor(task.status)}`}>
                  {task.status || 'Pending'}
                </span>
              </p>
            </div>
            {/* Button Section: Show buttons only for non-admins */}
            {userRole !== 'admin' && (
              <div className="flex justify-end space-x-3 mt-4">
                {/* Show Accept button only if status is Pending */}
                {task.status === 'Pending' && (
                  <button
                    onClick={() => updateTaskStatus(task.id, 'Accepted')}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 shadow-sm hover:shadow-md"
                  >
                    Accept
                  </button>
                )}
                {/* Show Completed and Failed buttons only if status is Accepted */}
                {task.status === 'Accepted' && (
                  <>
                    <button
                      onClick={() => updateTaskStatus(task.id, 'Completed')}
                      className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors duration-200 shadow-sm hover:shadow-md"
                    >
                      Completed
                    </button>
                    <button
                      onClick={() => updateTaskStatus(task.id, 'Failed')}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 shadow-sm hover:shadow-md"
                    >
                      Failed
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskList;