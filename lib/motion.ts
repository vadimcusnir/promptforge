export const motion = {};

export const getMotionMode = async (): Promise<'on' | 'off'> => {
  try {
    // In development, always return 'on' for motion
    if (process.env.NODE_ENV === 'development') {
      return 'on';
    }
    
    // In production, you could check user preferences here
    return 'on';
  } catch (error) {
    console.error('Error in getMotionMode:', error);
    return 'off';
  }
};
