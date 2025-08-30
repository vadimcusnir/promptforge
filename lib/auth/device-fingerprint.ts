export interface DeviceFingerprint {
  userAgent: string
  screenResolution: string
  timezone: string
  language: string
  platform: string
  cookieEnabled: boolean
  doNotTrack: string
}

export class DeviceFingerprintCollector {
  static collect(): DeviceFingerprint {
    return {
      userAgent: navigator.userAgent,
      screenResolution: `${screen.width}x${screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language,
      platform: navigator.platform,
      cookieEnabled: navigator.cookieEnabled,
      doNotTrack: navigator.doNotTrack || 'unspecified',
    }
  }

  static getDeviceType(userAgent: string): 'mobile' | 'tablet' | 'desktop' {
    const ua = userAgent.toLowerCase()
    if (/mobile|android|iphone|ipod|blackberry|iemobile|opera mini/i.test(ua)) {
      return 'mobile'
    }
    if (/tablet|ipad|playbook|silk/i.test(ua)) {
      return 'tablet'
    }
    return 'desktop'
  }

  static getBrowserInfo(userAgent: string): { name: string; version: string } {
    const ua = userAgent
    if (ua.includes('Chrome') && !ua.includes('Edge')) {
      const match = ua.match(/Chrome\/(\d+\.\d+)/)
      return { name: 'Chrome', version: match ? match[1] : 'Unknown' }
    }
    if (ua.includes('Firefox')) {
      const match = ua.match(/Firefox\/(\d+\.\d+)/)
      return { name: 'Firefox', version: match ? match[1] : 'Unknown' }
    }
    if (ua.includes('Safari') && !ua.includes('Chrome')) {
      const match = ua.match(/Version\/(\d+\.\d+)/)
      return { name: 'Safari', version: match ? match[1] : 'Unknown' }
    }
    if (ua.includes('Edge')) {
      const match = ua.match(/Edge\/(\d+\.\d+)/)
      return { name: 'Edge', version: match ? match[1] : 'Unknown' }
    }
    return { name: 'Unknown', version: 'Unknown' }
  }

  static getOSInfo(userAgent: string): { name: string; version: string } {
    const ua = userAgent
    if (ua.includes('Windows')) {
      if (ua.includes('Windows NT 10.0')) return { name: 'Windows', version: '10' }
      if (ua.includes('Windows NT 6.3')) return { name: 'Windows', version: '8.1' }
      if (ua.includes('Windows NT 6.2')) return { name: 'Windows', version: '8' }
      if (ua.includes('Windows NT 6.1')) return { name: 'Windows', version: '7' }
      return { name: 'Windows', version: 'Unknown' }
    }
    if (ua.includes('Mac OS X')) {
      const match = ua.match(/Mac OS X (\d+[._]\d+)/)
      return { name: 'macOS', version: match ? match[1].replace('_', '.') : 'Unknown' }
    }
    if (ua.includes('Linux')) {
      return { name: 'Linux', version: 'Unknown' }
    }
    if (ua.includes('iPhone') || ua.includes('iPad')) {
      const match = ua.match(/OS (\d+[._]\d+)/)
      return { name: 'iOS', version: match ? match[1].replace('_', '.') : 'Unknown' }
    }
    if (ua.includes('Android')) {
      const match = ua.match(/Android (\d+\.\d+)/)
      return { name: 'Android', version: match ? match[1] : 'Unknown' }
    }
    return { name: 'Unknown', version: 'Unknown' }
  }
}