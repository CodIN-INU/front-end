import { Tag, tagsArray } from '@/interfaces/partners';

interface ITag {
  tag: string | Tag;
  other?: boolean;
}

const tagMap: Record<Tag, string> = {
  COMPUTER_SCI: '컴공',
  EMBEDDED: '임베',
  INFO_COMM: '정통',
  IT_COLLEGE: '정보대',
};

/*
리디자인 이전

export function Tags(
  { tag, other }: ITag = {
    tag: 'undefined',
    other: false,
  }
) {
  return (
    <div
      className={`${
        !other ? 'bg-main text-white' : 'bg-sub text-normal opacity-70'
      } min-w-fit px-[9px] pt-[2px] pb-[3px] rounded-[5px] text-[12px] leading-[1.45]`}
    >
      {!other && '#'} {tagMap[tag as Tag] ? tagMap[tag] : tag}
    </div>
  );
}

export function OtherTag({ tags }: { tags: Tag[] }) {
  return (
    <>
      {tagsArray.every(tag => tags.includes(tag)) ||
      tags.includes('IT_COLLEGE') ? (
        <Tags
          tag="정보대 제휴"
          other
        />
      ) : (
        <Tags
          tag="학과 제휴"
          other
        />
      )}
    </>
  );
}
*/

export function Tags(
  { tag, other }: ITag = {
    tag: 'undefined',
    other: false,
  }
) {

  return (
    <div
      className={`${
        !other ? 'bg-[#EBF0F7] text-sub' : 'bg-[#0D99FF] text-white'
        } text-[10px] px-[9.5px] py-[3.5px] flex justify-center items-center rounded-[20px] flex-shrink-0`}
    >
      #{tagMap[tag as Tag] ? tagMap[tag] : tag}
    </div>
  );
}

export function OtherTag({ tags }: { tags: Tag[] }) {
  return (
    <>
      {tagsArray.every(tag => tags.includes(tag)) ||
      tags.includes('IT_COLLEGE') ? (
        <Tags
          tag="정보대 제휴"
          other
        />
      ) : (
        <Tags
          tag="학과 제휴"
          other
        />
      )}
    </>
  );
}