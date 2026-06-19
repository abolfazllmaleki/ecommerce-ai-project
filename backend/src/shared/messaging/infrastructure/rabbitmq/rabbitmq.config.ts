export interface RabbitMqConfig {
  url: string;
  exchange: string;
}

export const getRabbitMqConfig = (): RabbitMqConfig => {
  const url = process.env.RABBITMQ_URL;
  const exchange = process.env.RABBITMQ_EXCHANGE || 'app.events';

  if (!url) {
    throw new Error('RABBITMQ_URL is not defined');
  }

  return {
    url,
    exchange,
  };
};
