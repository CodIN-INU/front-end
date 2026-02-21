const calcEmotion = (rating: number) => {
  if (rating <= 1.5) {
    return '힘들어요';
  } else if (rating <= 3.5) {
    return '괜찮아요';
  } else return '최고에요';
};

export { calcEmotion };
