import { promisify } from 'util';
import { createClient } from 'redis';

class RedisClient {
  constructor() {
    this.client = createClient();
    this.isClientConnected = true;
    this.client.on('error', (err) => {
      console.error('Redis client failed to connect:', err.message || err.toString());
      this.isClientConnected = false;
    });
    this.client.on('connect', () => {
      this.isClientConnected = true;
    });
  }

  /**
   * Checks connection to Redis if Alive
   * @return {boolean} true i alive or false if not
   */
  isAlive() {
    return this.isClientConnected;
  }

  /**
   * gets value to key in redis
   * @key {string} key to search in redis
   * @return {string}  key value
   */
  async get(key) {
    return promisify(this.client.GET).bind(this.client)(key);
  }

  /**
   * Creates a new key
   * @key {string} key saved in redis
   * @value {string} value asigned to key
   * @duration {number} TTL of key
   * @return {undefined}  No return
   */
  async set(key, value, duration) {
    await promisify(this.client.SETEX)
      .bind(this.client)(key, duration, value);
  }

  /**
   * Deletes key in redis
   * @key {string} key to be deleted
   * @return {undefined}  No return
   */
  async del(key) {
    await promisify(this.client.DEL).bind(this.client)(key);
  }
}

export const redisClient = new RedisClient();
export default redisClient;
