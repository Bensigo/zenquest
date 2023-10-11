
export const getLevel = (score: number) => {
    if (score >= 0 && score <= 200) {
        return 'Eden';
    } else if (score >= 201 && score <= 1000) {
        return 'Alpha';
    } else if (score >= 1001 && score <= 6000) {
        return 'Omega';
    } else if (score >= 6001 && score <= 15000) {
        return 'Titan';
    } else if (score >= 15001 && score <= 40000) {
        return 'Zenith';
    } else if (score >= 40001) {
        return 'GodMode';
    } else {
        return;
    }
  };