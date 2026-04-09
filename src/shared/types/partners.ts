export type Tag = 'COMPUTER_SCI' | 'EMBEDDED' | 'INFO_COMM' | 'IT_COLLEGE';
export const tagsArray: Tag[] = ['COMPUTER_SCI', 'EMBEDDED', 'INFO_COMM'];
export interface IPartner {
  name: string;
  tags: Tag[];
  benefits: string[];
  start_date: Date;
  end_date: Date;
  location: string;
  img: {
    main: string;
    sub: string[];
  };
}

export interface IPartners {
  id: string;
  name: string;
  mainImg: string;
  tags: Tag[];
}
