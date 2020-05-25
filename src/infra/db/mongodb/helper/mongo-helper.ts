import { MongoClient, Collection } from "mongodb";
export const MongoHelper = {
  client: null,
  url: null,

  async connect(url: string): Promise<void> {
    this.url = url;
    this.client = await MongoClient.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  },

  async disconnect(): Promise<void> {
    await this.client.close();
    this.client = null;
  },

  async getCollection(name: string): Promise<Collection> {
    if (!this.client?.isConnected()) {
      await this.connect(this.url);
    }
    return this.client.db().collection(name);
  },

  map: (data: any): any => {
    const { _id, ...collectionWithoutId } = data;
    return { id: _id, ...collectionWithoutId };
  },

  mapArray: (collection: any[]): any[] => {
    return collection.map((c) => MongoHelper.map(c));
  },
};
