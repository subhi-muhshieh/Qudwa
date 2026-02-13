export const updateActivityStatuses = async (supabase) => {
  try {
    // Throttle: only run once every 5 minutes per session
    if (typeof window !== 'undefined') {
      const THROTTLE_KEY = 'activity_status_last_check';
      const THROTTLE_MS = 5 * 60 * 1000; // 5 minutes
      
      const lastCheck = sessionStorage.getItem(THROTTLE_KEY);
      if (lastCheck && Date.now() - parseInt(lastCheck) < THROTTLE_MS) {
        return 0;
      }
    }

    const { data: activities, error } = await supabase
      .from('activities')
      .select('id, activity_date, start_time, end_time, is_upcoming')
      .eq('is_upcoming', true);
    
    if (error || !activities) return 0;
    
    const now = new Date();
    const idsToUpdate = [];
    
    activities.forEach(activity => {
      if (activity.activity_date) {
        const activityDate = new Date(activity.activity_date);
        
        if (activity.end_time) {
          const [hours, minutes] = activity.end_time.split(':');
          activityDate.setHours(parseInt(hours), parseInt(minutes));
        } else if (activity.start_time) {
          const [hours, minutes] = activity.start_time.split(':');
          activityDate.setHours(parseInt(hours) + 2, parseInt(minutes));
        } else {
          activityDate.setHours(23, 59, 59);
        }
        
        if (activityDate < now) {
          idsToUpdate.push(activity.id);
        }
      }
    });
    
    if (idsToUpdate.length > 0) {
      const { error: updateError } = await supabase
        .from('activities')
        .update({ is_upcoming: false })
        .in('id', idsToUpdate);
      
      if (updateError) {
        console.error('Error updating activity statuses:', updateError);
      }
    }

    // Save timestamp after successful check
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('activity_status_last_check', Date.now().toString());
    }
    
    return idsToUpdate.length;
  } catch (err) {
    console.error('Error updating activity statuses:', err);
    return 0;
  }
};