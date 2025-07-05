/**
 * Checks if the current operating system is iOS using modern APIs with fallbacks.
 * @returns {boolean} True if the OS is iOS, otherwise false.
 */
export const isIOS = () => {
    // First, check if the modern API exists
    if (navigator.userAgentData && navigator.userAgentData.platform) {
        // If it exists, use it
        return ['iPhone', 'iPad', 'iPod'].includes(navigator.userAgentData.platform);
    }

    // If not, fall back to older methods that are more widely supported
    return [
        'iPad Simulator',
        'iPhone Simulator',
        'iPod Simulator',
        'iPad',
        'iPhone',
        'iPod'
    ].includes(navigator.platform)
        // Also include a check for modern iPads that can report as 'MacIntel'
        || (navigator.userAgent.includes("Mac") && "ontouchend" in document);
}