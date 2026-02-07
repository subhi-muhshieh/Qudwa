// app/utils/activityHelpers.js

export const updateActivityStatuses = async (supabase) => {
  try {
    // Fetch only upcoming activities to check if they should be marked as past
    const { data: activities, error } = await supabase
      .from('activities')
      .select('id, activity_date, start_time, end_time, is_upcoming')
      .eq('is_upcoming', true);
    
    if (error || !activities) return;
    
    const now = new Date();
    const idsToUpdate = [];
    
    activities.forEach(activity => {
      if (activity.activity_date) {
        const activityDate = new Date(activity.activity_date);
        
        // Determine when the activity ends
        if (activity.end_time) {
          // Use end_time if available
          const [hours, minutes] = activity.end_time.split(':');
          activityDate.setHours(parseInt(hours), parseInt(minutes));
        } else if (activity.start_time) {
          // If only start_time, assume 2 hour duration
          const [hours, minutes] = activity.start_time.split(':');
          activityDate.setHours(parseInt(hours) + 2, parseInt(minutes));
        } else {
          // If no time specified, use end of day (23:59)
          activityDate.setHours(23, 59, 59);
        }
        
        // If the activity has passed, add to update list
        if (activityDate < now) {
          idsToUpdate.push(activity.id);
        }
      }
    });
    
    // Batch update all expired activities
    if (idsToUpdate.length > 0) {
      const { error: updateError } = await supabase
        .from('activities')
        .update({ is_upcoming: false })
        .in('id', idsToUpdate);
      
      if (!updateError) {
        console.log(`✅ Auto-updated ${idsToUpdate.length} activities to past status`);
      }
    }
    
    return idsToUpdate.length;
  } catch (err) {
    console.error('Error updating activity statuses:', err);
    return 0;
  }
};