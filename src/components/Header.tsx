import React from 'react';

interface HeaderProps {
    categoria: 'normal' | 'A';
}

export const Header: React.FC<HeaderProps> = ({ categoria }) => {
  const modeTitle = categoria === 'A' ? 'de alquiler' : 'de venta';
  const logoBase64 = "iVBORw0KGgoAAAANSUhEUgAACAAAAAHZCAYAAAASDtsEAAAQAElEQVR4AeydB4AV1dXHz5l5W2hSVey9Y8XesaA0Ec2uWFA0iu3Dhr2OilQFBRvEFhNNstgQRKqYmJiYaIwpJppEY6yxI3V335vz/S92pWyZ996dt//Zc/bOmzdz7jm/O2/KvXfuBMKJBEigyQQii4JofpQZOmNoxfk157eKpkWtz5oftR06I1rjkjmXtD/7iSs2OmPaFbuf/fhlfc+ZftlJQ2dcdt7QGVdc+38zLp9w1vQrf3LWE5dP/7/pl80/84lLf3v29Mv/Bv33WdOveO+M6Vd8esb0KxecOf3K7JnTrrRv6hn4fPo3dMjjVy0cMv2qBadPu+rDM6Zf9Z/Tp1399zOmXf089DfQGWdOv7rm9OnXTDp9+tWjTpt+9SVDpkdDhky9uuq0x686YPC0aOvzZ47rNBT+njL14naDZo1tc/