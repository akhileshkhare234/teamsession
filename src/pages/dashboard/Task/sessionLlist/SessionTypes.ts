interface Image {
  id: number;
  imageUrl: string;
  latitude: string;
  longitude: string;
  imageLocation: string;
}

interface Tag {
  id: number;
  tagName: string;
  images: Image[];
}

export interface SessionData {
  id: number;
  customerName: string;
  loginTime: string;
  loginLat: string;
  loginLong: string;
  logoutTime: string;
  logoutLat: string;
  logoutLong: string;
  status: number;
  tags: Tag[];
  loginLocation: string;
  logoutLocation: string;
}
