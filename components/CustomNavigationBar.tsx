  import { Appbar } from 'react-native-paper';
  import { NativeStackHeaderProps } from '@react-navigation/native-stack';
  import { getHeaderTitle } from '@react-navigation/elements';
  import React from 'react';

  export default function CustomNavigationBar({ navigation, back, options, route }: NativeStackHeaderProps) {
    const title = getHeaderTitle(options, route.name);

    return (
      <Appbar.Header>
        <Appbar.Content title={title} />
      </Appbar.Header>
    );
  }