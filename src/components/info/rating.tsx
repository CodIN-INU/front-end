import { Stars } from '@public/icons/star';

type ratedRef = 0 | 0.25 | 0.5 | 0.75 | 1;

export default function Rating({ score }: { score: number }) {
  function getStarValues(rating: number): ratedRef[] {
    const clamped = Math.max(0, Math.min(5, rating)); // 0 ~ 5로 제한
    const stars: ratedRef[] = [];

    for (let i = 0; i < 5; i++) {
      const raw = clamped - i; // 해당 별에 남은 점수
      const value = Math.max(0, Math.min(1, raw)); // 0~1 사이로 자르기
      const rounded = Math.round(value * 4) / 4; // 0.25 단위 반올림
      stars.push(rounded as ratedRef);
    }

    return stars;
  }

  return (
    <div className="flex items-center gap-[4px]">
      {getStarValues(score).map((v, i) => {
        const StarIcon = Stars[v];
        return (
          <StarIcon
            key={i}
            width={36}
            height={34}
            className="text-yellow-500"
          />
        );
      })}
    </div>
  );
}
