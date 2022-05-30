import cnt from './constant';

const cal = {
  boundaryPM25: value => {
    if (0 <= value && value < 15.5)
      return cnt.PM25_GOOD
    else if (15.5 <= value && value < 35.5)
      return cnt.PM25_MOD
    else if (35.5 <= value && value < 75.5)
      return cnt.PM25_BAD
    else if (75.5 <= value)
      return cnt.PM25_VERY_BAD
    else
      return cnt.PM25_EMPTY
  }
}

export default cal
